import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import DatePicker from '@/components/DatePicker';
import { updateTrip } from '@/lib/trips';
import { Currency, TripFormData } from '@/type';
import { formatDateForDB } from '@/utils/helpers';
import { currencies } from '@/variables';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { Text, View, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';

interface EditTripProps {}

const EditTrip = (props: EditTripProps) => {

  const {tripId} = useLocalSearchParams()

  const [formData, setFormData] = React.useState<TripFormData>({
          name: 'New one',
          startDate: new Date(),
          endDate: new Date(),
          defaultCurrency: 'EUR'
      });
  

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
      
      
              try {
                  const tripData = {
                      name: formData.name.trim(),
                      dateStart: formatDateForDB(formData.startDate),
                      dateEnd: formatDateForDB(formData.endDate),
                      defaultCurrency: formData.defaultCurrency
                  };

                  const newTrip =await updateTrip(tripId as string, tripData);
      
                  Alert.alert("Trip updated successfully!");
                  router.replace("/");
                  //console.log("Trip Updated:", tripData);

              } catch (error: any) {
                  console.error("Updating Trip Error:", error);
                  Alert.alert('Error', error.message);
              } 
          };

  return (
    <View className='flex gap-4 bg-white  p-5 mt-3' style= {{marginBottom: Platform.OS === 'ios' ? 20 : 50}}>
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
                <View className='w-full flex flex-row gap-2 flex-wrap'>
                              {currencies.map((currency) => (
                                <TouchableOpacity
                                  key={currency.value}
                                    onPress={() => updateField('defaultCurrency', currency.value as Currency)}
                                    className={`w-[23%] h-12  ${formData.defaultCurrency === currency.value ? 'border-2 border-secondary' : 'border border-gray-300'} rounded-xl flex items-center justify-center`}
                                >
                                  <Text numberOfLines={1} ellipsizeMode="tail">{currency.value}</Text>
                                </TouchableOpacity>
                              ))}
                            </View>
            </View>
      <CustomButton
        text="Save Changes"
        onPress={() => {
          submit();
        }}
      />
    </View>
  );
};

export default EditTrip;


