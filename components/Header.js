import React from 'react'
import { Text, View } from 'react-native'
import styles from '../style/Style'
import { horizontalScale, moderateScale, verticalScale } from './Metrics'

export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>
        Mini-Yahtzee
      </Text>
    </View>
  )
}