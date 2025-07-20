import Avatar from '@/components/Avatar';
import CustomButton from '@/components/CustomButton';
import { getTripParticipants } from '@/lib/participants';
import { getUsersTrips } from '@/lib/trips';
import useAuthStore from '@/store/auth.store';
import { Participant, Trip } from '@/type';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from 'expo-router';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, SafeAreaView, Text, View } from "react-native";


export default function Index() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [allParticipants, setAllParticipants] = useState<{ [tripId: string]: Participant[] }>({});
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
      const userTrips = await getUsersTrips(user.$id);
      //console.log("Fetched user's trips:", userTrips);
      setTrips(userTrips);

      // load participants for each trip in format {tripId: Participant[]}
      const participantsData: { [tripId: string]: Participant[] } = {};
      for (const trip of userTrips) {
        try {
          const participants = await getTripParticipants(trip.$id);
          participantsData[trip.$id] = participants;
        } catch (error) {
          console.error(`Error loading participants for trip ${trip.$id}:`, error);
          participantsData[trip.$id] = []; // Fallback to empty array
        }
      }
      //console.log("participantData", JSON.stringify(participantsData, null, 2));
      setAllParticipants(participantsData);

      //console.log("Fetched trips with participants:", userTrips, participantsData);
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
  }, [user]); // Reloads when user changes

  // Reload trips when the screen is focused
  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchTrips();
      }
    }, [user])
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

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
            const participants = allParticipants[item.$id] || []; // Fallback to empty array if no participants found

            return (
              <View>
                <Pressable
                  className='bg-white rounded-xl flex justify-between p-3 mb-3'
                  style={{
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <View>
                    <Text className="h2">
                      {item.name}
                    </Text>
                    <Text className="text-regular text-xs">
                      {`${formatDate(item.dateStart)} - ${formatDate(item.dateEnd)}`}
                    </Text>
                    <Text className="text-regular text-xs text-myGray mt-1">
                      Currency: {item.defaultCurrency}
                    </Text>
                  </View>

                  <View className='flex flex-row items-center justify-between mt-2'>
                    <Text className='h3'>Participants:</Text>
                    <View className='flex-row justify-end items-center h-12 gap-0.5'>
                      {participants.length > 0 ? (
                        participants.slice(0, 3).map((participant, index) => (
                          <Avatar key={participant.$id} name={participant.name} />
                        ))
                      ) : (
                        <Text className="text-xs text-myGray">No participants</Text>
                      )}
                      {participants.length > 3 && (
                        <View className="bg-myGray rounded-full w-8 h-8 justify-center items-center ml-1">
                          <Text className="text-white text-xs">+{participants.length - 3}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </Pressable>
              </View>
            )
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
