import { Expense, ExpenseShare, Participant, Trip } from '@/type';
import { formatDateForDisplay } from '@/utils/helpers';
import { currencies } from '@/variables';
import { router } from 'expo-router';
import * as React from 'react';
import { useEffect } from 'react';
import { Text, View, StyleSheet, Pressable, Share } from 'react-native';
import Avatar from './Avatar';
import { getExpenseSharesByExpenseId } from '@/lib/expenseShares';

interface ExpenseItemProps {
    trip: Trip;
    expense: Expense;
}

const ExpenseItem = ({
    trip, expense
}: ExpenseItemProps) => {

    const [shares, setShares] = React.useState<ExpenseShare[]>([]);
    const currencySymbol = currencies.find(c => c.value === expense.currency)?.symbol || expense.currency;

    useEffect(() => {
        // Fetch shares when the component mounts
        const fetchShares = async () => {
            const response = await getExpenseSharesByExpenseId(expense.$id);
            setShares(response);
        };
        fetchShares();
    }, [expense.$id]);

    // Hilfsfunktion: Namen aus participantId holen
    const getParticipantName = (participantId: string) => {
        const participant = trip.participants.find((p: Participant) => p.$id === participantId);
        return participant ? participant.name : '';
    };

    // Namen der Leute, die einen Share haben
    const participantsWhoShareNames = shares
        .filter(share => share.participantId !== expense.payerId)
        .map(share => getParticipantName(share.participantId))
        .filter(name => !!name)

    //console.log("participantsWhoShareNames:", participantsWhoShareNames);

    return (
        <Pressable className='bg-white rounded-xl flex justify-between p-3 mb-3'
            style={{
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
                gap: 7,
            }} onPress={() => router.push(`/trip/${trip.$id}/expense/${expense.$id}`)}>
            <View className='flex flex-row justify-between items-center'>
                <Text className='text-regular'>{`${formatDateForDisplay(expense.date.toLocaleString())} `}</Text>
                <Text className='text-regular'>{`${expense.amount}${currencySymbol} `}</Text>
            </View>
            <Text className='text-regular' numberOfLines={1}
                ellipsizeMode="tail">{expense.description}</Text>
            <View className='flex flex-row gap-2'>
                <Text className='text-regular text-sm '>Paid by: </Text>
                <Text className='text-regular'>{trip.participants.find((p: Participant) => p.$id === expense.payerId)?.name}</Text>
            </View>
            <View className='flex flex-row items-center justify-between gap-2'>
                <Text className='text-regular text-sm'>Shared with: </Text>
                <View className='flex-row justify-end items-center h-12 gap-0.5'>
                    {participantsWhoShareNames.length > 0 ? (
                        participantsWhoShareNames.map((name, index) => (
                            <Avatar key={index} name={name} />
                        ))
                    ) : (
                        <Text className="text-regular text-xs text-myGray">Individual expense</Text>
                    )}

                </View>
            </View>

        </Pressable>
    );
};

export default ExpenseItem;

const styles = StyleSheet.create({
    container: {}
});


