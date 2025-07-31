import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import DatePicker from "@/components/DatePicker";
import { updateExpense } from "@/lib/expenses";
import useTripsStore from "@/store/trips.store";
import { Currency, ExpenseLike } from "@/type";
import { currencies } from "@/variables";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, View, StyleSheet, Alert, TouchableOpacity, Platform } from "react-native";

const EditExpense = () => {
  const { tripId, expenseId } = useLocalSearchParams();
  const { trips, fetchExpenses, getExpensesForTrip } = useTripsStore();
  const trip = trips.find((t) => t.$id === tripId);

  const expenses = getExpensesForTrip(tripId as string);
  
  const initialExpense = expenses.find((e) => e.$id === expenseId);

  const initialData: ExpenseLike = {
  description: initialExpense?.description || "",
  amount: initialExpense?.amount || 0,
  currency: initialExpense?.currency || trip?.defaultCurrency || "EUR",
  date: initialExpense?.date ? new Date(initialExpense.date) : new Date(),
  type: initialExpense?.type || "individual",
  tripId: tripId as string,
  payerId: initialExpense?.payerId || trip?.participants[0].$id || "",
};

const [formData, setFormData] = useState<ExpenseLike>(initialData);

  const isDataChanged = (initial: ExpenseLike, current: ExpenseLike) => {
  return (
    initial.description !== current.description ||
    initial.amount !== current.amount ||
    initial.currency !== current.currency ||
    initial.type !== current.type ||
    initial.payerId !== current.payerId ||
    initial.date.getTime() !== current.date.getTime()
  );
};

  const submit = async () => {
    try {
      if (!isDataChanged(initialData, formData)) {
      Alert.alert("No changes detected");
      return;
    }
      await updateExpense(expenseId as string, formData);
      await fetchExpenses(tripId as string);
      Alert.alert("Expense updated successfully!");
      router.back();
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white', marginBottom: Platform.OS === 'ios' ? 0 : 50, padding: 20, gap: 16 }}>
      <CustomInput
        placeholder="Describe the expense"
        label="Description"
        labelClassName="h3"
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
      />

      {/***** Date Picker *****/}

      <View>
        <Text className="h3">Date</Text>
        <DatePicker
          value={formData.date}
          onDateChange={(date) => setFormData({ ...formData, date })}
          maximumDate={new Date()} // Prevent future dates
        />
      </View>

      <View className="flex gap-2">
        <Text className="h3">Expense currency</Text>

        <View className="w-full flex flex-row gap-2 flex-wrap">
          {currencies.map((currency) => (
            <TouchableOpacity
              key={currency.value}
              onPress={() =>
                setFormData({
                  ...formData,
                  currency: currency.value as Currency,
                })
              }
              className={`w-[23%] h-12  ${
                formData.currency === currency.value
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

      <CustomButton text="Save changes" onPress={submit} classname="bg-primary w-full h-12 flex items-center justify-center rounded-xl my-10"/>
    </View>
  );
};

export default EditExpense;


