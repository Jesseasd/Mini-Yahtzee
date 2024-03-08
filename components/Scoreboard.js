import * as React from 'react'
import { useEffect, useState } from 'react'
import { ScrollView, Text } from 'react-native'
import { DataTable } from 'react-native-paper'
import { SCOREBOARD_KEY } from "../constants/Game"
import AsyncStorage from "@react-native-async-storage/async-storage"
import styles from "../style/Style"
import { moderateScale } from './Metrics'

export default function Scoreboard({ navigation }) {
  const [items, setItems] = useState([])
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData()
    })
    return unsubscribe
  }, [navigation])

  const getData = async () => {
    try {
      const json = await AsyncStorage.getItem(SCOREBOARD_KEY)
      let parsedJson = JSON.parse(json || "[]")

      // Sort items by totalPoints in descending order (highest score first)
      parsedJson.sort((a, b) => b.totalPoints - a.totalPoints)

      setItems(parsedJson)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <ScrollView>
      <DataTable>

        {items.length > 0 && items.map((item) => (
          <DataTable.Row style={styles.tableRow} key={item.key}>

            <DataTable.Cell>
              <Text style={styles.smallerText}>
                {item.playerName}
              </Text>
            </DataTable.Cell>

            <DataTable.Cell numeric>
              <Text style={[styles.smallerText, {fontSize: moderateScale(15)}]}>
                {item.datetime}
              </Text>
            </DataTable.Cell>

            <DataTable.Cell numeric>
              <Text style={styles.smallerText}>
                {item.totalPoints}
              </Text>
            </DataTable.Cell>

          </DataTable.Row>
        ))}

      </DataTable>
    </ScrollView>
  )
}
