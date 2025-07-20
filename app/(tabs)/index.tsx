import CustomButton from '@/components/CustomButton';
import TripCard from '@/components/TripCard';
import { getTripsWithParticipants, TripWithParticipants } from '@/lib/trips';
import useAuthStore from '@/store/auth.store';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from 'expo-router';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, SafeAreaView, Text, View } from "react-native";


export default function Index() {
  const [trips, setTrips] = useState<TripWithParticipants[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  const fetchTrips = async () => {
    try {
      setLoading(true);
      if (!user) {
        Alert.alert("Error", "No user logged in");
        return;
      }

      // load user's trips
      const userTrips = await getTripsWithParticipants(user.$id);
      //console.log("Fetched user's trips:", userTrips);
      setTrips(userTrips);

      
      } catch (error) {
      console.error("Error fetching user's trips:", error);
      Alert.alert("Error", "Failed to fetch trips");
    } finally {
      setLoading(false);
    }
  };

  // Fetch trips when the component mounts or when user changes
  useEffect(() => {
    if (user) {
      fetchTrips();
    }
  }, [user]); 

  // Reload trips when the screen is focused
  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchTrips();
      }
    }, [user])
  );

  
  return (
    <SafeAreaView className="flex-1 mx-3">
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

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-regular">Loading trips...</Text>
        </View>
      ) : (
        <FlatList
          data={trips}
          renderItem={({ item }) => {
            //console.log("Rendering trip:", item);
            return <TripCard trip={item} />;
          }}
          keyExtractor={(item) => item.$id}
          contentContainerStyle={{ paddingBottom: 30 }}

          ListEmptyComponent={() => (
            <View className="flex justify-center items-center mt-10">
              <Text className="text-regular text-myGray">No trips found</Text>
              <Text className="text-xs text-myGray mt-2">Create your first trip!</Text>
            </View>
          )}

          ListFooterComponent={() => (
            <View className="flex justify-center items-center mt-5">
              <Text className="text-regular text-xs text-myGray">Developed with ❤️ by Anna Popova</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
