import CustomButton from '@/components/CustomButton';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FlatList, Pressable, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { Fragment } from 'react';
import Avatar from '@/components/Avatar';

const trips = [
  { id: "1", title: "Trip to Paris", startDate: "2023-10-01", endDate: "2023-10-10", participants: ["Alice Braun", "Bob"] },
  { id: "2", title: "Beach Vacation", startDate: "2023-11-05", endDate: "2023-11-12", participants: ["Charlie", "Alice backgroundColor"] },
  { id: "3", title: "Mountain Hiking", startDate: "2023-12-15", endDate: "2023-12-20", participants: ["Eve Lucky", "Frank", "Alice Braun"] },
  { id: "4", title: "City Exploration", startDate: "2024-01-10", endDate: "2024-01-15", participants: ["Bob", "Charlie"] },
  { id: "5", title: "Cultural Festival", startDate: "2024-02-20", endDate: "2024-02-25", participants: ["Alice Braun", "Eve Lucky"] },
  { id: "6", title: "Adventure Trip", startDate: "2024-03-05", endDate: "2024-03-10", participants: ["Frank", "Charlie", "Eve Lucky"] },
  { id: "7", title: "Relaxing Retreat", startDate: "2024-04-01", endDate: "2024-04-07", participants: ["Alice Braun", "Bob", "Frank Marly Sonne"] },
];


export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-white mx-3">

<Fragment>
            <Text className="h1 text-center text-secondary">
              Your Trips
            </Text>
            <View className="flex flex-row items-center justify-between my-3">
              <Text className='h3'>{`You have ${trips.length} trips`}</Text>
              <Pressable className="bg-tertiary rounded-full p-2" onPress={() => alert('Logout')}>
                <Ionicons name="exit-outline" size={24} color="white" />
              </Pressable>
            </View>
            <CustomButton text="Add New Trip" onPress={() => alert('Add New Trip')} />
          </Fragment>

      <FlatList
        data={trips}
        renderItem={({ item }) => {
          return (
            <View>
              <Pressable className='bg-white rounded-xl flex justify-between p-3 mb-3'
                style={{
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 5, // für Android
                }}>
                <View>
                  <Text className="h2">
                    {item.title}
                  </Text>
                  <Text className="text-regular text-xs">
                    {`${item.startDate} - ${item.endDate}`}
                  </Text>
                </View>

                <View className='flex flex-row items-center justify-between'>
                  <Text className='h3'>
                    Participants: </Text>
                  <View className=' flex-row justify-end items-center h-12'>
                    {item.participants.map((participant, index) => (
                      <Avatar key={index} name={participant} />
                    ))}
                  </View>
                </View>
              </Pressable>
            </View>
          )
        }
        }
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 30 }}
        

        ListFooterComponent={() => (
          <View className="flex justify-center items-center mt-5">
            <Text className="text-regular text-xs text-myGray ">Developed with ❤️ by Anna Popova</Text>
          </View>
        )}
      />

    </SafeAreaView>
  );
}
