import useTripsStore from '@/store/trips.store';
import { Participant } from '@/type';
import { formatDateForDisplay } from '@/utils/helpers';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import cn from "clsx";


const ExpenseDetails = () => {
  const { expenseId, tripId } = useLocalSearchParams();
  const { trips, getExpensesForTrip, fetchExpenseSharesByExpense, getExpenseSharesForExpense } = useTripsStore();


  // fetch expense shares when the component mounts
  useEffect(() => {
    if (tripId) {
      fetchExpenseSharesByExpense(expenseId as string);
    }
  }, [expenseId, tripId, fetchExpenseSharesByExpense]);


  // Get shares for the expense
  const shares = getExpenseSharesForExpense(expenseId as string);
  //console.log("shares:", JSON.stringify(shares, null, 2));


  // Get the expense details
  const expenses = getExpensesForTrip(tripId as string);
  const expense = expenses.find(e => e.$id === expenseId);
  //console.log("expense:", JSON.stringify(expense, null, 2));

  // Get participants for the trip
  const trip = trips.find(t => t.$id === tripId);
  const participants = trip?.participants || [];

  // Find the payer for the expense
  const payer = participants.find(p => p.$id === expense?.payerId);

  // get participants who share the expense
  const participantsWhoShare = shares.map(share => {
    const participant = participants.find(p => p.$id === share.participantId);
    return participant ? { ...participant, shareAmount: share.amount } : null;
  }).filter(Boolean); // Filter out any null values
  //console.log("participantsWhoShare:", JSON.stringify(participantsWhoShare, null, 2));

  return (
    <View className="px-4">

      {!expense || !trip ? (
        <Text>Loading...</Text>
      ) : (
        <View>

          {/* EXPENSE DETAILS */}

          <View className='flex border-b-[1px] border-primary  pb-4 mb-4 w-full gap-2 '>
            <View className="mb-4">
              <View className="flex-row justify-between items-center">
                <Text className="h1 w-[85%]" numberOfLines={2} ellipsizeMode="tail">{expense.description}</Text>
                <Pressable className="p-2 flex items-end justify-center" onPress={() => router.push(`/trip/${tripId}/expense/edit/${expenseId}`)}>
                  <FontAwesome name="edit" size={24} color="#f6c445" />
                </Pressable>
              </View>
            </View>
            <View className='flex flex-row justify-between'>
              <Text className='text-regular font-bold'>Date</Text>
              <Text className="text-regular">
                {formatDateForDisplay(expense.date.toLocaleString())}
              </Text>
            </View>

            <View className='flex flex-row justify-between'>
              <Text className='text-regular font-bold'>Paid by</Text>
              <Text className='text-regular'>{payer?.name}</Text>
            </View>
            <View className='flex flex-row justify-between'>
              <Text className='text-regular font-bold'>Amount</Text>
              <Text className='text-regular'>{expense.amount}{expense.currency}</Text>
            </View>
            <View className='flex flex-row justify-between'>
              <Text className='text-regular font-bold'>Type of Expense</Text>
              <Text className='text-regular'>{expense.type}</Text>
            </View>

          </View>

          {/* SHARES if the expense is not individual */}

          {expense.type !== "individual" && (
            <View className='flex border-b-[1px] border-primary  pb-4 mb-4 w-full '>
              <Text className='h2 mb-2'>Shares</Text>

              {participantsWhoShare.map((participant, index) => {
                const isEven = index % 2 === 0;
                return (
                  <View key={participant!.$id} className={cn(
                    "flex flex-row items-center justify-between rounded-lg px-2 py-2 mb-1",
                    isEven ? "bg-gray-50" : ""
                  )}>
                    <Text className='text-regular font-semibold'>{`${participant!.name} `}</Text>
                    <Text className='text-regular font-semibold'>{`${participant!.shareAmount} ${trip.defaultCurrency}`}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

      )}
    </View>
  );
};

export default ExpenseDetails;


