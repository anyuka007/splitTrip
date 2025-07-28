import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import DatePicker from '@/components/DatePicker';
import Dropdown from '@/components/Dropdown';
import { createParticipant } from '@/lib/participants';
import { createTrip } from '@/lib/trips';
import useAuthStore from '@/store/auth.store';
import { Currency, TripFormData } from '@/type';
import { formatDateForDB } from '@/utils/helpers';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { currencies } from '@/variables'; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const CreateTrip = () => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { user } = useAuthStore(); // Assuming you have a user store to get the current user
    
    const [formData, setFormData] = useState<TripFormData>({
        name: '',
        startDate: new Date(),
        endDate: new Date(),
        defaultCurrency: 'EUR'
    });

    const [participants, setParticipants] = useState<string[]>([user!.name]);
    const [addParticipantMode, setAddParticipantMode] = useState(false);
    const [participantName, setParticipantName] = useState('');


    // Generic updater function
    const updateField = <K extends keyof TripFormData>(field: K, value: TripFormData[K]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    // ==============================================================
    // PARTICIPANT MANAGEMENT
    // ==============================================================

    // Function to check for duplicate participants
    const isDuplicateParticipant = (name: string) => {
        return participants.some(participant => participant.toLowerCase() === name.toLowerCase());
    };

    // Function to add a participant
    const addParticipantHandler = (name: string) => {
        if (!name.trim()) {
            return Alert.alert("Please enter participant name");
        }

        if (isDuplicateParticipant(name)) {
            return Alert.alert("Participant already exists");
        }
        // Add participant to the list 
        if (participants.length >= 5) {
            return Alert.alert("Maximum of 5 participants allowed");
        }
        setParticipants(prev => [...prev, name]);
        // Reset the form
        setAddParticipantMode(false);
        setParticipantName('');
    }
    // Function to remove a participant from the list
    const removeParticipantHandler = (index: number) => {
        setParticipants(prev => prev.filter((_, i) => i !== index));
    };

    // Function to create a participant
    const createParticipantHandler = async (name:string, tripId:string) => {
        
            try {
                await createParticipant({ name, tripId });
            } catch (error) {
                console.error("Error creating participant:", error);
                Alert.alert("Error", "Failed to create participant");
            }
        };
    // =============================================================
    // TRIP CREATION
    // =============================================================

    const submit = async () => {
        const { name, startDate, endDate, defaultCurrency } = formData;

        if (!name.trim()) {
            return Alert.alert("Error", "Please enter trip name");
        }

        if (participants.length === 0) {
            return Alert.alert("Please add at least one participant");
        }

        setIsSubmitting(true);
        try {
            const tripData = {
                name: name.trim(),
                dateStart: formatDateForDB(startDate),
                dateEnd: formatDateForDB(endDate),
                defaultCurrency
            };

            const newTrip =await createTrip(tripData);
            const tripId = newTrip.$id;

            // Create participants for the trip
            
            for (const participant of participants) {
                await createParticipantHandler(participant, tripId);
            }
            Alert.alert("Trip created successfully!");
            router.replace("/");
            //console.log("Trip Created:", tripData);

        } catch (error: any) {
            console.error("Creating Trip Error:", error);
            Alert.alert('Error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    //console.log("Form Data:", formData);

    return (
        <KeyboardAwareScrollView className='flex gap-4 bg-white  p-5 mt-3' contentContainerStyle={{ gap: 16}} style= {{marginBottom: Platform.OS === 'ios' ? 20 : 50}}>
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
                <Text className='label'>Participants (maximum 5)</Text>
                {participants.length > 0 ? participants.map((participant, index) => (
                    <View key={index} className="flex-row items-center gap-5 my-2">
                        <Pressable
                            onPress={() => removeParticipantHandler(index)}
                            className="px-2"
                        >
                            <FontAwesome name="remove" size={24} color="#e45f2b" />
                        </Pressable>
                        <Text className='text-regular'>{participant}</Text>
                    </View>
                )) : (
                    <Text className={!addParticipantMode ? "text-gray-500 text-regular" : "hidden"}>No participants</Text>
                )}
                <View className='flex items-end'>
                    <Pressable
                        disabled={participants.length >= 5}
                        onPress={() => setAddParticipantMode(true)}
                        className={addParticipantMode ? 'hidden' : participants.length >= 5 ? 'bg-secondary opacity-50 w-1/2 h-12 flex flex-row items-center justify-center rounded-xl my-2 gap-2' : 'bg-secondary w-1/2 h-12 flex flex-row items-center justify-center rounded-xl my-2 gap-2'}
                    >
                        <FontAwesome name="plus" size={16} color="white" />
                        <Text className="text-regular text-white font-medium">Add Participant</Text>
                    </Pressable>
                </View>

                {addParticipantMode && (
                    <View>
                        <CustomInput
                            placeholder="Enter participant name"
                            value={participantName}
                            onChangeText={(text) => { setParticipantName(text) }}
                        />
                        <View className='flex-row justify-between my-3'>
                            <CustomButton
                                text="Add"
                                onPress={() => addParticipantHandler(participantName)}
                                classname='w-[45%] h-12 bg-secondary rounded-xl my-2 flex items-center justify-center'
                                disabled={!participantName.trim()}
                            />
                            <CustomButton
                                text="Cancel"
                                onPress={() => { setAddParticipantMode(false); setParticipantName('') }}
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
        </KeyboardAwareScrollView>
    );
};

export default CreateTrip;