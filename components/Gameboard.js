import { useEffect, useState } from "react"
import { Text, View, Pressable } from "react-native"
import Header from "./Header"
import Footer from "./Footer"
import {
  NBR_OF_DICES,
  NBR_OF_THROWS,
  MIN_SPOT,
  MAX_SPOT,
  BONUS_POINTS_LIMIT,
  BONUS_POINTS,
  SCOREBOARD_KEY
} from "../constants/Game"
import { Container, Row, Col } from "react-native-flex-grid"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import styles from "../style/Style"
import { horizontalScale, moderateScale, verticalScale } from './Metrics'

let board = []

export default function Gameboard({ navigation, route }) {

  const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS)
  const [status, setStatus] = useState("")
  const [gameEndStatus, setGameEndStatus] = useState(false)

  // If dices are selected or not
  const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false))
  // Dice spots
  const [diceSpots, setDiceSpots] = useState(new Array(NBR_OF_DICES).fill(0))
  // If dice points are selected or not for spots
  const [selectedDicePoints, setSelectedDicePoints] = useState(new Array(MAX_SPOT).fill(false))
  // Total points for different spots
  const [dicePointsTotal, setDicePointsTotal] = useState(new Array(MAX_SPOT).fill(0))

  const [playerName, setPlayerName] = useState("")
  const [totalPoints, setTotalPoints] = useState([])
  const [items, setItems] = useState([])

  useEffect(() => {
    if (playerName === "" && route.params?.player) {
      setPlayerName(route.params.player)
    }
  }, [])

  useEffect(() => {
    setTotalPoints(calculateTotalPoints)
  })

  useEffect(() => {
    checkGameEnd()
    
    if (selectedDicePoints.every(selected => selected)) {
      
      const date = new Date()
      const hours = date.getHours()
      const minutes = date.getMinutes()
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes
      const datetime = date.toLocaleDateString() + " " + hours + ":" + formattedMinutes

      const newKey = items.length + 1
      const newItem = {
        key: newKey.toString(),
        playerName: playerName,
        datetime: datetime,
        totalPoints: totalPoints
      }
      const newItems = [...items, newItem]
      storeData(newItems)
      console.log("new items", newItems)
    }
    
  }, [nbrOfThrowsLeft, totalPoints])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData()
    })
    return unsubscribe
  }, [navigation])

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(SCOREBOARD_KEY, jsonValue)
    }
    catch (e) {
      console.log(e)
    }
  }

  const getData = async() => {
    try {
      return AsyncStorage.getItem(SCOREBOARD_KEY)
      .then(req => JSON.parse(req))
      .then(json => {
        if (json === null) {
          json = []
        }
        setItems(json)
      })
      .catch(e => console.log(e))
    }
    catch (e) {
      console.log(e)
    }
  }

  const dices = []
  for (let dice = 0; dice < NBR_OF_DICES; dice++) {
    dices.push(
      <Col key={"dice" + dice}>
        <Pressable 
            key={"dice" + dice}
            onPress={() => selectDice(dice)}
          >
          <MaterialCommunityIcons
            name={board[dice]}
            key={"dice" + dice}
            size={moderateScale(40)}
            color={getDiceColor(dice)}
          >
          </MaterialCommunityIcons>
        </Pressable>
      </Col>
    )
  }

  const pointsRow = []
  for (let spot = 0; spot < MAX_SPOT; spot++) {
    pointsRow.push(
      <Col key={"pointsRow" + spot}>
        <Text style={styles.smallerText} key={"pointsRow" + spot}>{getSpotTotal(spot)}</Text>
      </Col>
    )
  }

  const pointsToSelectRow = []
  for (let diceButton = 0; diceButton < MAX_SPOT; diceButton++) {
    pointsToSelectRow.push(
      <Col key={"buttonsRow" + diceButton}>
        <Pressable 
            key={"buttonsRow" + diceButton}
            onPress={() => selectDicePoints(diceButton)}
          >
          <MaterialCommunityIcons
            name={"numeric-" + (diceButton + 1) + "-circle"}
            key={"buttonsRow" + diceButton}
            size={moderateScale(35)} 
            color={getDicePointsColor(diceButton)}
          >
          </MaterialCommunityIcons>
        </Pressable>
      </Col>
    )
  }

  const selectDice = (i) => {
    let dices = [...selectedDices]
    if (!gameEndStatus){
      if (nbrOfThrowsLeft > 2) {
        updateStatusWithTimeout("Throw before selecting dices")
      } else {
      dices[i] = selectedDices[i] ? false : true
      setSelectedDices(dices)
      }
    }
  }

  function getDiceColor(i) {
    return selectedDices[i] ? "#3D634F" : "#66A182"
  }

  function getDicePointsColor(i) {
    return selectedDicePoints[i] ? "#3D634F" : "#66A182"
  }

  const selectDicePoints = (i) => {
    if (!gameEndStatus) {
      if (nbrOfThrowsLeft === 0) {
        let selectedPoints = [...selectedDicePoints]
        let points = [...dicePointsTotal]
        
        if (!selectedPoints[i]) {
          selectedPoints[i] = true
          let nbrOfDices = 
            diceSpots.reduce(
              (total, x) => (x === (i + 1) ? total + 1 : total), 0)
          points[i] = nbrOfDices * (i + 1)
          setDicePointsTotal(points)
          selectedPoints[i] = true

          let selected = selectedDices.map((value, index) => {
            if (diceSpots[index] === (i + 1)) {
              return false
            }
            return value
          })
          
          setSelectedDicePoints(selectedPoints)
          setSelectedDices(selected)
          setNbrOfThrowsLeft(NBR_OF_THROWS)
          setSelectedDices(new Array(NBR_OF_DICES).fill(false))
          return points[i]
        } else {
          updateStatusWithTimeout("You already selected points for " + (i + 1))
        }
      } else {
        updateStatusWithTimeout("Throw " + NBR_OF_THROWS + " times before setting points")
      }
    }
  }

  const throwDices = () => {
    if (nbrOfThrowsLeft > 0) {
      let spots = [...diceSpots]
      for (let i = 0; i < NBR_OF_DICES; i++) {
        if (!selectedDices[i]) {
          let randomNumber = Math.floor(Math.random() * MAX_SPOT + 1)
          spots[i] = randomNumber
          board[i] = 'dice-' + randomNumber
        }
      }
      setDiceSpots(spots)
      setNbrOfThrowsLeft(nbrOfThrowsLeft-1)
    } else {
      updateStatusWithTimeout("Select number")
    }
  }

  function getSpotTotal(i) {
    return dicePointsTotal[i]
  }

  const calculateTotalPoints = () => {
    let total = dicePointsTotal.reduce((total, points) => total + points, 0)
    return total >= BONUS_POINTS_LIMIT ? total + BONUS_POINTS : total
  }

  const checkGameEnd = () => {
    const allNumbersSelected = selectedDicePoints.every(selected => selected)
    if (allNumbersSelected) {
      setGameEndStatus(true)
    }
  }

  const restartGame = () => {
    // Reset the values of numbers and points
    setDiceSpots(new Array(NBR_OF_DICES).fill(0))
    setDicePointsTotal(new Array(MAX_SPOT).fill(0))
    setSelectedDicePoints(new Array(MAX_SPOT).fill(false))
    
    // Reset the selected state of dices
    setSelectedDices(new Array(NBR_OF_DICES).fill(false))
    
    // Reset the game end status
    setGameEndStatus(false)
    
    // Reset the status message
    updateStatusWithTimeout("Throw dices")
  }

  const updateStatusWithTimeout = (message) => {
    setStatus(message)
    setTimeout(() => {
      setStatus("")
    }, 2000)
  }

  return (
    <View style={styles.container}>

      <Header/>

      <Container>
        <Text style={styles.smallerText}>{playerName}</Text>
        <Text style={styles.smallerText}>Total points: {totalPoints}</Text>
        <Text style={styles.smallerText}>Throws left: {nbrOfThrowsLeft}</Text>
      </Container>

      <Container style={styles.statusContainer}>
        <Text style={styles.status}>{status}</Text>
      </Container>
      
      {totalPoints < BONUS_POINTS_LIMIT ? (
      <Text style={styles.smallerText}>You are {BONUS_POINTS_LIMIT - totalPoints} points away from bonus</Text>
      ) : (
        <Text style={styles.smallerText}>Congrats! Bonus points ({BONUS_POINTS}) added</Text>
      )}

      <Container>
        <Row style={styles.points}>{pointsRow}</Row>
      </Container>

      <Container>
        <Row>{pointsToSelectRow}</Row>
      </Container>
      

      <Container style={styles.dices}>
        {selectedDices.some(dice => dice) || diceSpots.some(spot => spot) ? (
          <Row>{dices}</Row>
        ) : (
          <Row style={styles.center}>
            <MaterialCommunityIcons
              name={"dice-multiple-outline"}
              size={moderateScale(40)}
              color={"#66A182"}
            />
          </Row>
        )}
      </Container>

      <Pressable
        style={styles.throwBtn}
        onPress={() => {
          if (gameEndStatus) {
            restartGame()
          } else {
            throwDices()
          }
        }}>
          <Text style={styles.throwBtnText}>{gameEndStatus ? "Play again" : "Throw dices"}</Text>
      </Pressable>
    </View>
  )
}