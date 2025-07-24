import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import DatePicker from '@/components/DatePicker';
import Dropdown from '@/components/Dropdown';
import { createTrip } from '@/lib/trips';
import useAuthStore from '@/store/auth.store';
import { Currency, TripFormData } from '@/type';
import { formatDateForDB } from '@/utils/helpers';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';



const CreateTrip = () => {
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const {user} = useAuthStore(); // Assuming you have a user store to get the current user
    
    const [formData, setFormData] = useState<TripFormData>({
        name: '',
        startDate: new Date(),
        endDate: new Date(),
        defaultCurrency: 'EUR'
    });

    const [participants, setParticipants] = useState<string[]>([user!.name]);
    const [isAddParticipant, setIsAddParticipant] = useState(false);
    const [participantName, setParticipantName] = useState('');

    const currencies = [
        { label: 'Euro (EUR)', value: 'EUR' },
        { label: 'US Dollar (USD)', value: 'USD' },
        { label: 'Ukrainian Hryvnia (UAH)', value: 'UAH' },
        { label: 'Polish Złoty (PLN)', value: 'PLN' },
    ];   
    
    // Generic updater function
    const updateField = <K extends keyof TripFormData>(field: K, value: TripFormData[K]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const addParticipantHandler = (name: string) => {
        if (!name.trim()) {
            return Alert.alert("Error", "Please enter participant name");
        }
        setParticipants(prev => [...prev, name]);
        setParticipantName('');
        setIsAddParticipant(false);
    }

      const submit = async () => {
        const { name, startDate, endDate, defaultCurrency } = formData;
        
        if (!name.trim()) {
            return Alert.alert("Error", "Please enter trip name");
        }

        setIsSubmitting(true);
        try {
            const tripData = {
                name: name.trim(),
                dateStart: formatDateForDB(startDate),
                dateEnd: formatDateForDB(endDate),
                defaultCurrency
            };

            await createTrip(tripData);
            Alert.alert("Trip created successfully!");
            router.replace("/");
            console.log("Trip Created:", tripData);

        } catch (error: any) {
            console.error("Creating Trip Error:", error);
            Alert.alert('Error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    //console.log("Form Data:", formData);

    return (
        <ScrollView className='gap-10 bg-white rounded-lg p-5 mt-5'>
            <CustomInput 
                placeholder="Enter trip name" 
                value={formData.name} 
                label="Trip Name" 
                onChangeText={(text) => updateField('name', text)}
            />
            
            <View>
                <Text className="label">Start date</Text>
                <DatePicker 
                    value={formData.startDate}
                    onDateChange={(date) => updateField('startDate', date)}
                />
            </View>
            
            <View>
                <Text className="label">End date</Text>
                <DatePicker 
                    value={formData.endDate}
                    onDateChange={(date) => updateField('endDate', date)}
                    minimumDate={formData.startDate}
                />
            </View>

            <View className='flex'>
                <Text className='label'>Trip currency</Text>
                <Dropdown
                    items={currencies}
                    selectedValue={formData.defaultCurrency}
                    onValueChange={(currency) => updateField('defaultCurrency', currency as Currency)}
                    pickerStyle={{ height: 60 }}
                />
            </View>

            <View className='flex'>
                <Text className='label'>Participants</Text>
                {participants.length > 0 ? participants.map((participant, index) => (
                    <View key={index} className="flex-row items-center gap-5 my-2">
                        <Pressable
                            onPress={() => setParticipants(prev => prev.filter((_, i) => i !== index))}
                            className="px-2"
                        >
                            <FontAwesome name="remove" size={24} color="#e45f2b" />
                        </Pressable>
                        <Text>{participant}</Text>
                    </View>
                )) : (
                    <Text className={!isAddParticipant ? "text-gray-500" : "hidden"}>No participants</Text>
                )}
                <View className='flex items-end'>
                <Pressable
                    onPress={() => setIsAddParticipant(true)}
                    className={isAddParticipant ? 'hidden' : 'bg-secondary w-1/2 h-12 flex flex-row items-center justify-center rounded-xl my-2 gap-2'}
                >
                    <FontAwesome name="plus" size={16} color="white" />
                    <Text className="text-white font-medium">Add Participant</Text>
                </Pressable>
                </View>

                { isAddParticipant && (
                    <View>
                    <CustomInput
                        placeholder="Enter participant name"
                        value={participantName}
                        onChangeText={(text) => setParticipantName(text)}
                    />
                    <View className='flex-row justify-between'>
                        <CustomButton
                            text="Add"
                            onPress={()=>addParticipantHandler(participantName)}
                            classname='w-[45%] h-12 bg-secondary rounded-xl my-2 flex items-center justify-center'
                        />
                        <CustomButton
                            text="Cancel"
                            onPress={()=>setIsAddParticipant(false)}
                            classname='w-[45%] h-12 bg-tertiary rounded-xl my-2 flex items-center justify-center'
                        />
                        </View>
                    </View>
                )}
            </View>
            
            <CustomButton 
                text="Create Trip" 
                isLoading={isSubmitting} 
                onPress={submit} 
            />
        </ScrollView>
    );
};

export default CreateTrip;