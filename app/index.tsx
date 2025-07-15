import CustomButton from '@/components/CustomButton';
import Avatar from '../components/Avatar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FlatList, Pressable, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

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

      <View className="flex flex-row items-center justify-between my-3">
        <Text className="text-lg font-quicksand-bold text-primary">
          Your Trips
        </Text>
        <Pressable className="bg-primary rounded-full p-2">
          <Ionicons name="exit-outline" size={24} color="black" />
        </Pressable>
      </View>

      <Text>{`You have ${trips.length} trips`}</Text>

      <CustomButton text="Add New Trip" onPress={() => alert('Add New Trip')} />

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
                  <Text className="text-xl ">
                    {item.title}
                  </Text>
                  <Text className="text-sm ">
                    {`${item.startDate} - ${item.endDate}`}
                  </Text>
                </View>

                <View className='flex flex-row items-center justify-between'>
                  <Text>
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
          <View className="flex-center mt-5">
            <Text className="paragraph-regular text-gray-100">Powered by Expo Router</Text>
          </View>
        )}
      />



    </SafeAreaView>
  );
}
