import CustomButton from "@/components/CustomButton";
import CustomCheckbox from "@/components/CustomCheckbox";
import CustomInput from "@/components/CustomInput";
import DatePicker from "@/components/DatePicker";
import { createExpense } from "@/lib/expenses";
import useTripsStore from "@/store/trips.store";
import {
  CreateExpenseShareData,
  Currency,
  ExpenseData,
  ExpenseLike,
  ExpenseType,
  Participant,
  Share,
} from "@/type";
import { formatDateForDisplay } from "@/utils/helpers";
import { currencies, expenseTypes } from "@/variables";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { createExpenseShare } from "@/lib/expenseShares";
import Toast from "react-native-toast-message";

const CreateExpense = () => {
  const { tripId } = useLocalSearchParams();
  const { trips, fetchExpenses, fetchExpenseSharesByTrip, fetchExpenseSharesByExpense } = useTripsStore();
  const trip = trips.find((t) => t.$id === tripId);

  const [expense, setExpense] = useState<ExpenseLike>({
    description: "",
    amount: 0,
    currency: trip?.defaultCurrency || "EUR",
    date: new Date(),
    type: "individual",
    tripId: tripId as string,
    payerId: trip?.participants[0].$id || "",
  });

  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    trip?.participants.map((p) => p.$id) || []
  );
  const [amountInput, setAmountInput] = useState("");
  const [shares, setShares] = useState<Share[]>([
    { participantId: expense.payerId, share: expense.amount },
  ]);

  const [isEditAmount, setIsEditAmount] = useState(false);
  const [tempShares, setTempShares] = useState<Share[]>(shares);
  const [shareInputs, setShareInputs] = useState<Record<string, string>>({});

  const [hasCustomShares, setHasCustomShares] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==============================================================
  // SHARES MANAGEMENT
  // ==============================================================

  const updateTempShare = (participantId: string, share: number) => {
    setTempShares((prevShares) => {
      const existingShare = prevShares.find(
        (s) => s.participantId === participantId
      );
      if (existingShare) {
        return prevShares.map((s) =>
          s.participantId === participantId ? { ...s, share } : s
        );
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
    const validShares = tempShares.filter((s) => !isNaN(s.share));
    const sum = validShares.reduce((acc, s) => acc + s.share, 0);

    if (Math.abs(sum - expense.amount) > 0.01) {
      Alert.alert(
        "Invalid Shares",
        `Total shares (${sum.toFixed(
          2
        )}) don't match expense amount (${expense.amount.toFixed(2)})`
      );
      return;
    }
    //console.log("tempShares", JSON.stringify(tempShares, null, 2));
    setShares([...tempShares]);
    setIsEditAmount(false);
    setHasCustomShares(true);

    // Unselect participants with 0 share
    setSelectedParticipants((prev) => {
      return prev.filter((participantId) => {
        const share =
          tempShares.find((s) => s.participantId === participantId)?.share || 0;
        const isPayer = participantId === expense.payerId;

        // Only keep participants with a share > 0 or if they are the payer
        return isPayer || share > 0;
      });
    });
  };

  const cancelEditingShares = () => {
    setTempShares([...shares]);
    setShareInputs({});
    setIsEditAmount(false);
  };

  const getShareValue = (participantId: string): number => {
    if (isEditAmount) {
      const tempShare = tempShares.find(
        (s) => s.participantId === participantId
      )?.share;
      if (tempShare !== undefined) {
        return tempShare;
      }

      const regularShare = shares.find(
        (s) => s.participantId === participantId
      )?.share;
      return regularShare || 0;
    }

    return shares.find((s) => s.participantId === participantId)?.share || 0;
  };

  useEffect(() => {
    if (isEditAmount || hasCustomShares) return; // Skip if in edit mode

    //console.log("Auto-calculating shares...");
    if (expense.type === "individual") {
      setShares([{ participantId: expense.payerId, share: expense.amount }]);
    } else if (
      expense.type === "shared" &&
      expense.amount &&
      selectedParticipants.length > 0
    ) {
      const shares =
        selectedParticipants.map((p) => ({
          participantId: p,
          share: Number(
            (expense.amount / selectedParticipants.length).toFixed(2)
          ),
        })) || [];
      setShares(shares);
      //console.log("shares", JSON.stringify(shares, null, 2));
    } else if (expense.type === "sponsored") {
      const allShares =
        selectedParticipants.map((p) => ({
          participantId: p,
          share: Number(
            (expense.amount / (selectedParticipants.length - 1)).toFixed(2)
          ),
        })) || [];
      const sponsoredShares = allShares.filter(
        (s) => s.participantId !== expense.payerId
      );
      setShares(sponsoredShares);
    }
  }, [
    expense.type,
    expense.amount,
    selectedParticipants,
    isEditAmount,
    hasCustomShares,
  ]);

  // Reset selected participants when type or amount changes
  useEffect(() => {
    if (expense.type === "individual") {
      setSelectedParticipants([expense.payerId]);
    } else {
      setSelectedParticipants(trip?.participants?.map((p) => p.$id) ?? []);
    }
    setIsEditAmount(false);
  }, [expense.type, expense.amount]);

  // Reset custom shares when type or payer changes
  useEffect(() => {
    //console.log("Resetting custom shares flag due to type/payer change");
    setHasCustomShares(false);
  }, [expense.type, expense.payerId]);

  // Participant selection toggle function
  const toggleParticipant = (participantId: string) => {
    setSelectedParticipants((prev) => {
      if (prev.includes(participantId)) {
        // Remove if already selected
        return prev.filter((id) => id !== participantId);
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
      //console.log("selectedParticipants:", selectedParticipants);
    } else {
      // Select all
      setSelectedParticipants(trip?.participants.map((p) => p.$id) || []);
    }
  };

  // Add payer to selected participants if not already included
  useEffect(() => {
    if (expense.payerId && !selectedParticipants.includes(expense.payerId)) {
      setSelectedParticipants((prev) => [...prev, expense.payerId]);
    }
  }, [expense.payerId]);

  // =================================================================
  // CREATE EXPENSE HANDLER
  // =================================================================
  const createExpenseHandler = async (
    expenseData: ExpenseData
  ): Promise<void> => {
    // Early return for validation
    if (!expense.description.trim()) {
      Alert.alert("Missing description", "Please enter a description.");
      return;
    }
    if (expense.amount <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid amount.");
      return;
    }

    setIsSubmitting(true);
    // Create expense object
    try {
      const newExpense = await createExpense(expenseData);
      const expenseId = newExpense.$id;

      // Create shares
      const expenseSharesData: CreateExpenseShareData[] =
        expense.type === "individual"
          ? [
              {
                tripId: tripId as string,
                expenseId,
                participantId: expense.payerId,
                amount: expense.amount,
              },
            ]
          : expense.type === "shared"
          ? selectedParticipants.map((participantId) => ({
              tripId: tripId as string,
              expenseId: expenseId,
              participantId,
              amount: getShareValue(participantId),
            }))
          : // Sponsored expenses
            selectedParticipants
              .filter((p) => p !== expense.payerId)
              .map((participantId) => ({
                tripId: tripId as string,
                expenseId,
                participantId,
                amount: getShareValue(participantId),
              }));

      // Save all shares to database
      await Promise.all(
        expenseSharesData.map((shareData) => createExpenseShare(shareData))
      );

      // Update store
      await fetchExpenses(tripId as string);
      await fetchExpenseSharesByTrip(tripId as string);
      await fetchExpenseSharesByExpense(expenseId);

      Toast.show({
        type: "success",
        text1: "Expense created successfully!",
      });
      // Navigate back
      router.back();
    } catch (error) {
      console.error("Error creating expense:", error);
      Alert.alert("Error", "Failed to create expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{
        flex: 1,
        backgroundColor: "white",
        marginBottom: Platform.OS === "ios" ? 0 : 50,
      }}
      contentContainerStyle={{ padding: 20, gap: 16 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraHeight={150}
      keyboardShouldPersistTaps="handled"
    >
      {trip && (
        <>
          <Text className="h1 text-center">{trip.name}</Text>
          <Text className="text-regular text-center">
            {formatDateForDisplay(trip.dateStart)} -{" "}
            {formatDateForDisplay(trip.dateEnd)}
          </Text>

          {/***** Description Input *****/}

          <CustomInput
            placeholder="Describe the expense"
            label="Description"
            labelClassName="h3"
            value={expense.description}
            onChangeText={(text) =>
              setExpense({ ...expense, description: text })
            }
          />

          {/***** Date Picker *****/}

          <View>
            <Text className="h3">Date</Text>
            <DatePicker
              value={expense.date}
              onDateChange={(date) => setExpense({ ...expense, date })}
              maximumDate={new Date()} // Prevent future dates
            />
          </View>

          {/***** Amount Input *****/}

          <CustomInput
            placeholder="Enter expense amount"
            label="Amount"
            labelClassName="h3"
            value={amountInput}
            onChangeText={(text) => {
              setAmountInput(text);
              const parsed = parseFloat(text.replace(",", "."));
              if (!isNaN(parsed)) {
                setExpense({
                  ...expense,
                  amount: parsed,
                });
              }
            }}
            keyboardType="numeric"
          />

          {/***** Currency Selection *****/}
          <View className="flex gap-2">
            <Text className="h3">Expense currency</Text>

            <View className="w-full flex flex-row gap-2 flex-wrap">
              {currencies.map((currency) => (
                <TouchableOpacity
                  key={currency.value}
                  onPress={() =>
                    setExpense({
                      ...expense,
                      currency: currency.value as Currency,
                    })
                  }
                  className={`w-[23%] h-12  ${
                    expense.currency === currency.value
                      ? "border-2 border-secondary"
                      : "border border-gray-300"
                  } rounded-xl flex items-center justify-center`}
                >
                  <Text numberOfLines={1} ellipsizeMode="tail">
                    {currency.value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/***** Payer Selection *****/}

          <View className="flex gap-2">
            <Text className="h3">Payer</Text>

            <View className="w-full flex flex-row gap-2 flex-wrap">
              {trip.participants.map((participant) => (
                <TouchableOpacity
                  key={participant.$id}
                  onPress={() =>
                    setExpense({ ...expense, payerId: participant.$id })
                  }
                  className={`w-[48%] h-12  ${
                    expense.payerId === participant.$id
                      ? "border-2 border-secondary"
                      : "border border-gray-300"
                  } rounded-xl flex items-center justify-center`}
                >
                  <Text numberOfLines={1} ellipsizeMode="tail">
                    {participant.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/***** Expense Type Selection *****/}

          <View className="flex gap-2">
            <Text className="h3">Select expense type</Text>
            <View className="flex flex-row gap-2">
              {expenseTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  onPress={() =>
                    setExpense({ ...expense, type: type.value as ExpenseType })
                  }
                  className={`w-[32%] h-12  ${
                    expense.type === type.value
                      ? "border-2 border-secondary"
                      : "border border-gray-300"
                  } rounded-xl flex items-center justify-center`}
                >
                  <Text>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View className="flex">
              {expense.type !== "individual" && (
                <>
                  <Text className="label">
                    Select participants who should pay for this expense
                  </Text>

                  {/* Select All/None Button */}

                  <View style={{ marginBottom: 8 }}>
                    <CustomCheckbox
                      isChecked={
                        selectedParticipants.length === trip.participants.length
                      }
                      onToggle={toggleAllParticipants}
                      label="Select all"
                      color="#007bff"
                    />
                  </View>

                  {/* Individual Participant Checkboxes */}

                  {expense.type === "shared" && (
                    <>
                      {trip.participants.map((participant: Participant) => (
                        <View
                          key={participant.$id}
                          className="flex flex-row justify-between items-center"
                        >
                          <CustomCheckbox
                            isChecked={selectedParticipants.includes(
                              participant.$id
                            )}
                            onToggle={() => toggleParticipant(participant.$id)}
                            label={`${participant.name}${
                              participant.$id === expense.payerId
                                ? " (Payer)"
                                : ""
                            }`}
                            color={
                              participant.$id === expense.payerId
                                ? "#28a745"
                                : "#f6c445"
                            }
                            disabled={participant.$id === expense.payerId}
                          />
                          {!!expense.amount &&
                            selectedParticipants.length > 0 &&
                            selectedParticipants.includes(participant.$id) &&
                            (!isEditAmount ? (
                              <Text>
                                {getShareValue(participant.$id)}{" "}
                                {expense.currency}
                              </Text>
                            ) : (
                              <TextInput
                                placeholder="Enter share amount"
                                value={
                                  shareInputs[participant.$id] ??
                                  getShareValue(participant.$id).toString()
                                }
                                onChangeText={(text) => {
                                  setShareInputs((prev) => ({
                                    ...prev,
                                    [participant.$id]: text,
                                  }));
                                  const parsed = parseFloat(
                                    text.replace(",", ".")
                                  );
                                  updateTempShare(
                                    participant.$id,
                                    isNaN(parsed) ? 0 : parsed
                                  );
                                }}
                                style={{
                                  borderBottomWidth: 1,
                                  borderColor: "#ccc",
                                  padding: 8,
                                  borderRadius: 4,
                                  width: "30%",
                                }}
                                keyboardType="numeric"
                              />
                            ))}
                        </View>
                      ))}
                    </>
                  )}

                  {expense.type === "sponsored" && (
                    <>
                      {trip.participants.map((participant: Participant) => {
                        const isPayer = participant.$id === expense.payerId;
                        const isSelected = selectedParticipants.includes(
                          participant.$id
                        );

                        return (
                          <View
                            key={participant.$id}
                            className="flex flex-row justify-between items-center"
                          >
                            <CustomCheckbox
                              isChecked={isSelected} // Payer is always "selected" for sponsored
                              onToggle={() =>
                                !isPayer && toggleParticipant(participant.$id)
                              }
                              label={`${participant.name}${
                                isPayer ? " (Sponsor)" : ""
                              }`}
                              color={isPayer ? "#28a745" : "#f6c445"}
                              disabled={isPayer} // Sponsor can't be unchecked
                            />
                            {!!expense.amount &&
                              (isPayer || isSelected) &&
                              (isEditAmount && !isPayer ? (
                                <TextInput
                                  placeholder="Enter share amount"
                                  value={
                                    shareInputs[participant.$id] ??
                                    getShareValue(participant.$id).toString()
                                  }
                                  onChangeText={(text) => {
                                    setShareInputs((prev) => ({
                                      ...prev,
                                      [participant.$id]: text,
                                    }));
                                    const parsed = parseFloat(
                                      text.replace(",", ".")
                                    );
                                    updateTempShare(
                                      participant.$id,
                                      isNaN(parsed) ? 0 : parsed
                                    );
                                  }}
                                  keyboardType="numeric"
                                />
                              ) : (
                                <Text>
                                  {isPayer
                                    ? `Pays: ${expense.amount} ${expense.currency}`
                                    : `${
                                        shares.find(
                                          (s) =>
                                            s.participantId === participant.$id
                                        )?.share || 0
                                      } ${expense.currency}`}
                                </Text>
                              ))}
                          </View>
                        );
                      })}
                    </>
                  )}

                  {/* Error message if no participants selected */}
                  {selectedParticipants.length < 2 && (
                    <Text className="text-tertiary text-regular text-sm mt-2">
                      Please select at least one participant
                    </Text>
                  )}

                  {/* Edit shares buttons */}

                  {!!expense.amount && selectedParticipants.length > 1 && (
                    <View className="flex items-end">
                      {isEditAmount ? (
                        <View className="flex flex-row justify-between w-full">
                          <CustomButton
                            text="Cancel"
                            onPress={cancelEditingShares}
                            classname="w-[45%] h-12 bg-tertiary rounded-xl my-2 flex items-center justify-center"
                          />
                          <CustomButton
                            text="Save shares"
                            onPress={saveShares}
                            classname="w-[45%] h-12 bg-secondary rounded-xl my-2 flex items-center justify-center"
                          />
                        </View>
                      ) : (
                        <CustomButton
                          text="Edit shares"
                          onPress={startEditMode}
                          classname="w-[45%] h-12 bg-secondary rounded-xl my-2 flex items-center justify-center"
                        />
                      )}
                    </View>
                  )}
                </>
              )}
            </View>
          </View>

          {/***** Create Expense Button *****/}

          <CustomButton
            text="Create Expense"
            onPress={() => createExpenseHandler(expense)}
            isLoading={isSubmitting}
            whileLoadingText="Creating Expense..."
          />
        </>
      )}
    </KeyboardAwareScrollView>
  );
};

export default CreateExpense;
