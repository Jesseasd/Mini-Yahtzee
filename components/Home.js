import { useState } from 'react'
import { Text, View, TextInput, Pressable, Keyboard, ScrollView } from 'react-native'
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import Header from "./Header"
import Footer from "./Footer"
import {
  NBR_OF_DICES,
  NBR_OF_THROWS,
  MIN_SPOT,
  MAX_SPOT,
  BONUS_POINTS_LIMIT,
  BONUS_POINTS
} from "../constants/Game"
import styles from '../style/Style'
import { horizontalScale, moderateScale, verticalScale } from './Metrics'

export default function Home({ navigation }) {

  const [playerName, setPlayerName] = useState("")
  const [hasPlayerName, setHasPlayerName] = useState(false)

  const handlePlayerName = (value) => {
    if (value.trim().length > 0) {
      setHasPlayerName(true)
      Keyboard.dismiss()
    }
  }

  return (
    <>
      <Header />
      <View style={styles.container}>
        <MaterialCommunityIcons
          name="information"
          size={moderateScale(90)}
          color="#66A182"
        />
        {!hasPlayerName ?
          <>
            <Text style={[{marginTop: moderateScale(80)}, styles.smallerText]}>For scoreboard enter your name...</Text>
            <TextInput
              style={[styles.textInput, styles.smallerText]}
              onChangeText={setPlayerName}
              autoFocus={true}
            />
            <Pressable
              style={styles.button}
              onPress={() => handlePlayerName(playerName)}>
              <Text style={styles.smallerText}>OK</Text>
            </Pressable>
          </>
          :
          <>
            <ScrollView style={styles.scrollBottom}>
              <Text style={[styles.smallerText, styles.infoText]}>Rules of the game</Text>
              <Text multiline="true" style={[styles.smallerText, styles.infoText]}>
                THE GAME: Upper section of the classic Yahtzee
                dice game. You have {NBR_OF_DICES} dices and
                for the every dice you have {NBR_OF_THROWS}
                throws. After each throw you can keep dices in
                order to get same dice spot counts as many as
                possible. In the end of the turn you must select
                your points from {MIN_SPOT} to {MAX_SPOT}.
                Game ends when all points have been selected.
                The order for selecting those is free.
              </Text>
              <Text style={[styles.smallerText, styles.infoText]}>
                POINTS: After each turn game calculates the sum
                for the dices you selected. Only the dices having
                the same spot count are calculated. Inside the
                game you can not select same points from
                {MIN_SPOT} to {MAX_SPOT} again.
              </Text>
              <Text style={[styles.smallerText, styles.infoText]}>
                GOAL: To get points as much as possible.
                {BONUS_POINTS_LIMIT} points is the limit of
                getting bonus which gives you {BONUS_POINTS}
                points more.
              </Text>
              <Text style={[styles.smallerText, styles.infoText, {marginBottom: 20}]}>Good luck, {playerName}</Text>
            </ScrollView>

            <View style={styles.playBtnContainer}>
              <Pressable
                style={[styles.button, styles.center]}
                onPress={() => navigation.navigate("Gameboard", {player: playerName})}>
                <Text style={styles.smallerText}>Play</Text>
              </Pressable>
            </View>
          </>
        }
      </View>
      <Footer />
    </>
  )
}