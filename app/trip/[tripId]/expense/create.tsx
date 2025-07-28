import CustomButton from '@/components/CustomButton';
import CustomCheckbox from '@/components/CustomCheckbox';
import CustomInput from '@/components/CustomInput';
import DatePicker from '@/components/DatePicker';
import Dropdown from '@/components/Dropdown';
import { createExpense } from '@/lib/expenses';
import useTripsStore from '@/store/trips.store';
import { Currency, Expense, ExpenseType, Participant } from '@/type';
import { formatDateForDisplay } from '@/utils/helpers';
import { currencies, expenseTypes } from '@/variables';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View, } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
//import CheckBox from 'expo-checkbox';

interface CreateExpenseProps {
  tripId: string;

}

export type ExpenseLike = Pick<Expense, 'description' | 'amount' | 'currency' | 'date' | 'type' | 'conversionRate' | 'convertedAmount' | 'tripId' | 'payerId'>;

export interface ExpenseData {
  description: string;
  amount: number;
  currency: string;
  date: Date;
  type: ExpenseType;
  conversionRate?: number;
  convertedAmount?: number;
  tripId: string;
  payerId: string;
}

interface Share {
  participantId: string;
  share: number;
}

const CreateExpense = () => {
  const { tripId } = useLocalSearchParams();
  const { trips } = useTripsStore();
  const trip = trips.find(t => t.$id === tripId);

  const [expense, setExpense] = useState<ExpenseLike>({ description: "", amount: 0, currency: trip?.defaultCurrency || "EUR", date: new Date(), type: "individual", tripId: tripId as string, payerId: trip?.participants[0].$id || "" });

  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    trip?.participants.map(p => p.$id) || []
  );
  const [amountInput, setAmountInput] = useState('');
  const [shares, setShares] = useState<Share[]>([{ participantId: expense.payerId, share: expense.amount }]);

  const [isEditAmount, setIsEditAmount] = useState(false);
  const [tempShares, setTempShares] = useState<Share[]>(shares);
  const [shareInputs, setShareInputs] = useState<Record<string, string>>({});

  const updateTempShare = (participantId: string, share: number) => {
    setTempShares(prevShares => {
      const existingShare = prevShares.find(s => s.participantId === participantId);
      if (existingShare) {
        return prevShares.map(s => s.participantId === participantId ? { ...s, share } : s);
      } else {
        return [...prevShares, { participantId, share }];
      }
    });
  };

  const startEditMode = () => {
    setTempShares([...shares]);
    setShareInputs(
      shares.reduce((acc, s) => {
        acc[s.participantId] = s.share.toString();
        return acc;
      }, {} as Record<string, string>)
    );
    setIsEditAmount(true);
  };

  const saveShares = () => {
    // NaN-Check and sum validation
    const validShares = tempShares.filter(s => !isNaN(s.share));
    const sum = validShares.reduce((acc, s) => acc + s.share, 0);


    if (Math.abs(sum - expense.amount) > 0.01) {
      Alert.alert(
        "Invalid Shares",
        `Total shares (${sum.toFixed(2)}) don't match expense amount (${expense.amount.toFixed(2)})`
      );
      return;
    }

    setShares([...tempShares]);
    setIsEditAmount(false);
  };

  const cancelEditingShares = () => {
    setTempShares([...shares]);
    setShareInputs({});
    setIsEditAmount(false);
  };

  const getShareValue = (participantId: string): number => {
    if (isEditAmount) {
      const tempShare = tempShares.find(s => s.participantId === participantId)?.share;
      if (tempShare !== undefined) {
        return tempShare;
      }

      const regularShare = shares.find(s => s.participantId === participantId)?.share;
      return regularShare || 0;
    }

    return shares.find(s => s.participantId === participantId)?.share || 0;
  };

  useEffect(() => {
    if (isEditAmount) return; // Skip if in edit mode

    if (expense.type === "individual") {
      setShares([{ participantId: expense.payerId, share: expense.amount }]);
    } else if (expense.type === "shared" && expense.amount && selectedParticipants.length > 0) {
      const shares = selectedParticipants.map(p => ({ participantId: p, share: Number((expense.amount / selectedParticipants.length).toFixed(2)) })) || []
      setShares(shares);
      console.log("shares", JSON.stringify(shares, null, 2));
    } else if (expense.type === "sponsored") {
      const allShares = selectedParticipants.map(p => ({ participantId: p, share: Number((expense.amount / (selectedParticipants.length - 1)).toFixed(2)) })) || []
      const sponsoredShares = allShares.filter(s => s.participantId !== expense.payerId);
      setShares(sponsoredShares);
    }
  }, [expense.type, expense.amount, selectedParticipants, isEditAmount]);

  // Participant selection toggle function
  const toggleParticipant = (participantId: string) => {
    setSelectedParticipants(prev => {
      if (prev.includes(participantId)) {
        // Remove if already selected
        return prev.filter(id => id !== participantId);
      } else {
        // Add if not selected
        return [...prev, participantId];
      }
    });
  };

  // Select all participants
  const toggleAllParticipants = () => {
    if (selectedParticipants.length === trip?.participants.length) {
      // Deselect all
      setSelectedParticipants([expense.payerId]);
      console.log("selectedParticipants:", selectedParticipants); // Ensure payer is always included

    } else {
      // Select all
      setSelectedParticipants(trip?.participants.map(p => p.$id) || []);
    }
  };

  // Add payer to selected participants if not already included
  useEffect(() => {

    if (expense.payerId && !selectedParticipants.includes(expense.payerId)) {
      setSelectedParticipants(prev => [...prev, expense.payerId]);
    }
  }, [expense.payerId]);

  const expenseData: ExpenseLike = {
    description: 'New Expense',
    amount: 2000,
    // currency: trip?.defaultCurrency || 'EUR',
    currency: 'USD', // Fixed: no more empty string
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    type: "shared",
    tripId: tripId as string,
    payerId: "68823df400278fc17ad6"
  };

  const createExpenseHandler = async (expenseData: ExpenseLike): Promise<Expense> => {
    if (!expense.description.trim()) {
      Alert.alert("Missing description", "Please enter a description.");
      return Promise.reject();
    }
    if (expense.amount <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid amount.");
      return Promise.reject();
    }
    try {

      const newExpense = await createExpense(expenseData);
      router.push(`/trip/${tripId}`);
      return newExpense;
    } catch (error) {
      console.error("Error creating expense:", error);
      throw error;
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: 'white' }}
      contentContainerStyle={{ padding: 20, gap: 16 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraHeight={150} // ✅ Extra Platz über der Tastatur
      keyboardShouldPersistTaps="handled"
    >
      <Text className='text-regular'>CreateExpense</Text>
      {trip && (
        <>
          <Text className='text-regular'>Trip Name: {trip.name}</Text>
          <Text className='text-regular'>Trip Date: {formatDateForDisplay(trip.dateStart)} - {formatDateForDisplay(trip.dateEnd)}</Text>


          <CustomInput
            placeholder="Enter expense description"
            label='Expense Description'
            value={expense.description}
            onChangeText={(text) => setExpense({ ...expense, description: text })}
          />


          <View>
            <Text className="label">Date</Text>
            <DatePicker
              value={expense.date}
              onDateChange={(date) => setExpense({ ...expense, date })}
            />
          </View>


          <CustomInput
            placeholder="Enter expense amount"
            label='Amount'
            value={amountInput}
            onChangeText={(text) => {
              setAmountInput(text);
              const parsed = parseFloat(text.replace(',', '.'));
              if (!isNaN(parsed)) {
                setExpense({
                  ...expense,
                  amount: parsed,
                });
              }
            }}
            keyboardType="numeric"
          />


          <View className='flex'>
            <Text className='label'>Expence currency</Text>
            <Dropdown
              items={currencies}
              selectedValue={expense.currency}
              onValueChange={(currency) => setExpense({ ...expense, currency: currency as Currency })}
              pickerStyle={{ height: 60 }}
            />
          </View>


          <View className='flex'>
            <Text className='label'>Payer</Text>
            <Dropdown
              items={trip.participants.map(p => ({ label: p.name, value: p.$id }))}
              selectedValue={expense.payerId}
              onValueChange={(payerId) => setExpense({ ...expense, payerId })}
              placeholder="Select Payer"
              pickerStyle={{ height: 60 }}
            />
          </View>


          <View className='flex'>
            <Text className='label'>Type of expense</Text>

            <Dropdown
              items={expenseTypes}
              selectedValue={expense.type}
              onValueChange={(type) => setExpense({ ...expense, type: type as ExpenseType })}
              pickerStyle={{ height: 60 }}
            />


            <View className='flex'>
              {expense.type === "individual" ? (
                <Text className='label'>{shares[0].share}</Text>
              ) : (
                <>
                  <Text className='label'>
                    Select participants who should pay for this expense
                  </Text>

                  {/* Select All/None Button */}
                  <View style={{ marginBottom: 8 }}>
                    <CustomCheckbox
                      isChecked={selectedParticipants.length === trip.participants.length}
                      onToggle={toggleAllParticipants}
                      label="Select all"
                      color="#007bff"
                    />
                  </View>

                  {/* Individual Participant Checkboxes */}
                  {expense.type === "shared" && (
                    <>
                      {trip.participants.map((participant: Participant) => (
                        <View key={participant.$id} className='flex flex-row justify-between items-center'>
                          <CustomCheckbox
                            isChecked={selectedParticipants.includes(participant.$id)}
                            onToggle={() => toggleParticipant(participant.$id)}
                            label={`${participant.name}${participant.$id === expense.payerId ? ' (Payer)' : ''}`}
                            color={participant.$id === expense.payerId ? '#28a745' : '#f6c445'}
                            disabled={participant.$id === expense.payerId}
                          />
                          {!!expense.amount && selectedParticipants.length > 0 && selectedParticipants.includes(participant.$id) && (
                            !isEditAmount ? (
                              <Text>
                                {getShareValue(participant.$id)} {expense.currency}
                              </Text>
                            ) : (
                              <CustomInput
                                placeholder="Enter share amount"
                                value={shareInputs[participant.$id] ?? getShareValue(participant.$id).toString()}
                                onChangeText={(text) => {
                                  setShareInputs(prev => ({ ...prev, [participant.$id]: text }));
                                  const parsed = parseFloat(text.replace(',', '.'));
                                  updateTempShare(participant.$id, isNaN(parsed) ? 0 : parsed);
                                }}
                                keyboardType='numeric'
                              />
                            )
                          )}

                        </View>
                      ))}
                    </>
                  )}

                  {expense.type === "sponsored" && (
                    <>
                      {trip.participants.map((participant: Participant) => {
                        const isPayer = participant.$id === expense.payerId;
                        const isSelected = selectedParticipants.includes(participant.$id);

                        return (
                          <View key={participant.$id} className='flex flex-row justify-between items-center'>
                            <CustomCheckbox
                              isChecked={isSelected} // Payer is always "selected" for sponsored
                              onToggle={() => !isPayer && toggleParticipant(participant.$id)}
                              label={`${participant.name}${isPayer ? ' (Sponsor)' : ''}`}
                              color={isPayer ? '#28a745' : '#f6c445'}
                              disabled={isPayer} // Sponsor can't be unchecked
                            />
                            {!!expense.amount && (isPayer || isSelected) && (
                              isEditAmount && !isPayer ? (
                                <TextInput
                                  placeholder="Enter share amount"
                                  value={shareInputs[participant.$id] ?? getShareValue(participant.$id).toString()}
                                  onChangeText={(text) => {
                                    setShareInputs(prev => ({ ...prev, [participant.$id]: text }));
                                    const parsed = parseFloat(text.replace(',', '.'));
                                    updateTempShare(participant.$id, isNaN(parsed) ? 0 : parsed);
                                  }}
                                  keyboardType="numeric"
                                />
                              ) : (
                                <Text>
                                  {isPayer
                                    ? `Pays: ${expense.amount} ${expense.currency}`
                                    : `${shares.find(s => s.participantId === participant.$id)?.share || 0} ${expense.currency}`}
                                </Text>
                              )
                            )}
                          </View>
                        );
                      })}
                    </>

                  )}
                  {/* Error message if no participants selected */}
                  {selectedParticipants.length < 2 && (
                    <Text className='text-tertiary text-regular text-sm mt-2'>
                      Please select at least one participant
                    </Text>
                  )}
                  {!!expense.amount && selectedParticipants.length > 1 && (
                    <View className='flex items-end'>
                      {isEditAmount ? (
                        <View className='flex flex-row justify-between w-full'>
                          <CustomButton text="Cancel" onPress={cancelEditingShares} classname='w-[45%] h-12 bg-tertiary rounded-xl my-2 flex items-center justify-center' />
                          <CustomButton text="Save shares" onPress={saveShares} classname='w-[45%] h-12 bg-secondary rounded-xl my-2 flex items-center justify-center' />
                        </View>

                      ) : (
                        <CustomButton text="Edit shares" onPress={startEditMode} classname='w-[45%] h-12 bg-secondary rounded-xl my-2 flex items-center justify-center' />
                      )}
                    </View>
                  )}

                </>
              )}


            </View>
          </View>


          <CustomButton text="Create Expense" onPress={() => createExpenseHandler(expense)} />
        </>
      )}
    </KeyboardAwareScrollView>
  );
};

export default CreateExpense;

const styles = StyleSheet.create({
  container: {}
});
