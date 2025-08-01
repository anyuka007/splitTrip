// app/trip/[id].tsx
import CustomButton from "@/components/CustomButton";
import ExpenseItem from "@/components/ExpenseItem";
import useTripsStore from "@/store/trips.store";
import { Expense, Participant } from "@/type";
import { formatDateForDisplay } from "@/utils/helpers";
import cn from "clsx";
import { Link, router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";

const TripDetails = () => {
  const { id } = useLocalSearchParams();
  const {
    trips,
    fetchExpenses,
    getExpensesForTrip,
    fetchExpenseSharesByTrip,
    getExpenseSharesForTrip,
    expensesLoading,
  } = useTripsStore();

  // Handle id type properly
  const tripId = Array.isArray(id) ? id[0] : id;
  const trip = trips.find((trip) => trip.$id === tripId);

  // *** FETCH EXPENSES AND SHARES ***

  // Fetch expenses when the trip loads
  useEffect(() => {
    if (tripId && !expensesLoading) {
      fetchExpenses(tripId);
    }
  }, [tripId]);

  // Use the store's selector to get expenses for this trip
  const tripExpenses = getExpensesForTrip(tripId!);
  
  // Get all shares for the trip
  const shares = getExpenseSharesForTrip(tripId!); // Get all shares for the trip
  //console.log("aaaaa Shares for trip:", shares);
  
  // Fetch expense shares for trip when the trip loads
  useEffect(() => {
    if (tripId && !expensesLoading) {
      fetchExpenseSharesByTrip(tripId);
      //console.log("aaaaaFetching shares for trip:", tripId);
    }
  }, [tripId, tripExpenses.length]);

  

  // *** BALANCE CALCULATIONS ***

  // Get participants from trip
  const participants =
    trip?.participants.map((participant) => participant as Participant) || [];
  const participantsIds =
    participants.map((participant) => participant.$id) || [];

  // Calculate total amount paid by a participant
  const paidByParticipant = (participantId: string): number => {
    const expenses = tripExpenses.filter(
      (expense) => expense.payerId === participantId
    );
    if (expenses.length > 0) {
      return expenses.reduce((total, expense) => total + expense.amount, 0);
    }
    return 0;
  };

  // Calculate shares for a participant
  const sharesByParticipant = (participantId: string) => {
    return shares.filter((share) => share.participantId === participantId);
  };

  const participantBalance = (participantId: string) => {
    const paid = paidByParticipant(participantId);
    const shares = sharesByParticipant(participantId);
    const totalShares = shares.reduce(
      (total, share) => total + share.amount,
      0
    );
    const balance = { paid, shares: totalShares.toFixed(2), balance: (paid - totalShares).toFixed(2) };
    //console.log(`aaaaaBalance for ${participantId}:`, balance);
    return balance;
  };

  if (!trip) {
    return (
      <View className="flex h-full items-center justify-center">
        <Text className="text-regular text-myGray">Trip not found</Text>
        <Link href="/">
          <Text className="text-center text-primary mt-4">Go Home</Text>
        </Link>
      </View>
    );
  }

  return (
    <View className="flex-1">
    <ScrollView style={{ flex: 1, height: "100%", paddingHorizontal: 16 }} contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="flex border-b-[1px] border-primary  pb-4 mb-4 w-full gap-1">
        <View className="mb-4 flex-row justify-between items-center">
          <Text
            className="h2 text-primary w-[75%]"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {trip.name}
          </Text>
          <CustomButton
            text="Edit"
            onPress={() => router.push(`/trip/${tripId}/edit`)}
            classname="bg-secondary w-[23%] h-12 flex items-center justify-center rounded-xl my-2"
          />
        </View>
        <View className="flex flex-row justify-between">
          <Text className="h4">Duration</Text>
          <Text className="text-regular">
            {`${formatDateForDisplay(trip.dateStart)} - ${formatDateForDisplay(
              trip.dateEnd
            )}`}
          </Text>
        </View>

        <View className="flex flex-row justify-between">
          <Text className="h4">Currency</Text>
          <Text className="text-regular">{trip.defaultCurrency}</Text>
        </View>
        <View className="flex flex-row justify-between">
          <Text className="h4">Participants </Text>
          <View className="flex flex-row gap-2">
            <Text className="text-regular">
              {participants.map((participant) => participant.name).join(", ")}
            </Text>
          </View>
        </View>
      </View>

      {/* BALANCES */}
      <View className="flex border-b-[1px] border-primary  pb-4 mb-4 w-full ">
        <Text className="h2 text-primary mb-2">Balances</Text>

        {tripExpenses && tripExpenses.length > 0 ? (
          <View className="gap-4">
            <View>
              <Text className="h4 mb-2">Shared balance</Text>
              {participants.map((participant, index) => {
                const balanceObj = participantBalance(participant.$id);
                const isPositive = Number(balanceObj.balance) > 0;
                const isEven = index % 2 === 0;
                return (
                  <View
                    key={participant.$id}
                    className={cn(
                      "flex flex-row items-center justify-between rounded-lg px-2 py-2 mb-1",
                      isEven ? "bg-gray-50" : ""
                    )}
                  >
                    <Text className="text-regular font-semibold">{`${participant.name} `}</Text>
                    <Text
                      className={cn(
                        "text-regular font-semibold",
                        isPositive ? "" : "text-tertiary"
                      )}
                    >{`${participantBalance(participant.$id).balance} ${
                      trip.defaultCurrency
                    }`}</Text>
                  </View>
                );
              })}
            </View>
            <View>
              <Text className="h4 mb-2">Total spent</Text>
              {participants.map((participant, index) => {
                const isEven = index % 2 === 0;
                return (
                  <View
                    key={participant.$id}
                    className={cn(
                      "flex flex-row items-center justify-between rounded-lg px-2 py-2 mb-1",
                      isEven ? "bg-gray-50" : ""
                    )}
                  >
                    <Text className="text-regular font-semibold">{`${participant.name} `}</Text>
                    <Text className="text-regular font-semibold">{`${
                      participantBalance(participant.$id).shares
                    } ${trip.defaultCurrency}`}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        ) : (
          <Text className="text-regular">No expenses found</Text>
        )}
      </View>

      {/* EXPENSES */}
      <View className="flex  pb-4 mb-4 w-full ">
        <Text className="h2 text-primary mb-2">Expenses</Text>

        {tripExpenses && tripExpenses.length > 0 ? (
          tripExpenses.map((expense: Expense) => (
            <ExpenseItem key={expense.$id} trip={trip} expense={expense} />
          ))
        ) : (
          <Text className="text-regular">No expenses found</Text>
        )}
        {/* <CustomButton
          text="Add Expense"
          onPress={() => router.push(`/trip/${tripId}/expense/create`)}
        /> */}
      </View>
    </ScrollView><View className="absolute bottom-7 left-0 w-full px-4">
      <CustomButton
        text="Add Expense"
        onPress={() => router.push(`/trip/${tripId}/expense/create`)}
      />
    </View>
  </View>
);
};

export default TripDetails;
