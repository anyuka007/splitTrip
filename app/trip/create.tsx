import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import DatePicker from '@/components/DatePicker';
import Dropdown from '@/components/Dropdown';
import { createTrip } from '@/lib/trips';
import { Currency, TripFormData } from '@/type';
import { formatDateForDB } from '@/utils/helpers';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';



const CreateTrip = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    
    const [formData, setFormData] = useState<TripFormData>({
        name: '',
        startDate: new Date(),
        endDate: new Date(),
        defaultCurrency: 'EUR'
    });

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
        <View className='gap-10 bg-white rounded-lg p-5 mt-5'>
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
            
            <CustomButton 
                text="Create Trip" 
                isLoading={isSubmitting} 
                onPress={submit} 
            />
        </View>
    );
};

export default CreateTrip;