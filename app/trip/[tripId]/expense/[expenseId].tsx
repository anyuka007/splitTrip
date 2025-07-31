import useTripsStore from '@/store/trips.store';
import { Participant } from '@/type';
import { formatDateForDisplay } from '@/utils/helpers';
import { router, useLocalSearchParams } from 'expo-router';
import { Text, View, StyleSheet, Pressable, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import cn from "clsx";
import { deleteExpense } from '@/lib/expenses';
import CustomButton from '@/components/CustomButton';
import ConfirmModal from '@/components/ConfirmModal';



const ExpenseDetails = () => {
  const { expenseId, tripId } = useLocalSearchParams();
  const { trips, fetchExpenses, getExpensesForTrip, fetchExpenseSharesByExpense, getExpenseSharesForExpense } = useTripsStore();

const [showModal, setShowModal] = useState(false);

  const handleCancelInModal = () => {
    console.log('Cancelled.');
    setShowModal(false);
  };
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


  // Function to delete the expense
  const deleteHandler = async () => {
    try {
      await deleteExpense(expenseId as string);
      // Refresh expenses after deletion
      setShowModal(false);
      await fetchExpenses(tripId as string);

      router.replace(`/trip/${tripId}`);
    } catch (error) {
      console.error("Error deleting expense:", error);
      Alert.alert("Error", "Failed to delete expense. Please try again.");
    }
  };

  return (
    <View className="px-4 h-full">

      {!expense || !trip ? (
        <Text>Loading...</Text>
      ) : (
        <View>

          {/* EXPENSE DETAILS */}

          <View className='flex border-b-[1px] border-primary  pb-4 mb-4 w-full gap-2 '>
            <View className="mb-4">
              <View className="flex-row justify-between items-center">
                <Text className="h2 text-primary w-[75%]" numberOfLines={2} ellipsizeMode="tail">{expense.description}</Text>
                <CustomButton text="Edit" onPress={() => router.push(`/trip/${tripId}/expense/edit/${expenseId}`)} classname='w-[23%] h-12 bg-secondary rounded-xl my-2 flex items-center justify-center' />
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
              <Text className='h2 text-primary mb-2'>Shares</Text>

              {participantsWhoShare.map((participant, index) => {
                const isEven = index % 2 === 0;
                return (
                  <View key={participant!.$id} className={cn(
                    "flex flex-row items-center justify-between rounded-lg px-2 py-2 mb-1",
                    isEven ? "bg-gray-50" : ""
                  )}>
                    <Text className='text-regular'>{`${participant!.name} `}</Text>
                    <Text className='text-regular'>{`${participant!.shareAmount} ${trip.defaultCurrency}`}</Text>
                  </View>
                );
              })}

            </View>
          )}
        </View>

      )}
      <View className='flex flex-row justify-end mt-4 absolute bottom-20 gap-2 w-full'>
          <CustomButton text="Delete Expense" onPress={() => setShowModal(true)} classname='w-[45%] h-12 bg-tertiary rounded-xl my-2 flex items-center justify-center' />

      <ConfirmModal
        visible={showModal}
        message="Are you sure you want to delete this expense?"
        onConfirm={deleteHandler}
        onCancel={handleCancelInModal}
        confirmText="Yes"
        cancelText="No"
      />
        
      </View>
    </View>
  );
};

export default ExpenseDetails;


