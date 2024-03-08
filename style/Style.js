import { StyleSheet } from 'react-native';
import { horizontalScale, moderateScale, verticalScale } from '../components/Metrics'

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    alignSelf: "center",
    height: verticalScale(70),
    width: horizontalScale(414)
  },
  header: {
    flexDirection: 'row',
    padding: 25,
  },
  smallerText: {
    fontSize: moderateScale(16),
    color: "#fff",
    fontFamily: "Poppins-Light"
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#66A182",
    borderRadius: 15,
    width: horizontalScale(250),
    height: verticalScale(40),
    marginTop: verticalScale(25),
    marginBottom: verticalScale(25),
    paddingLeft: horizontalScale(5),
    paddingRight: horizontalScale(5),
    color: "#fff"
  },
  title: {
    color: "#fff",
    flex: 1,
    fontSize: moderateScale(50),
    fontFamily: "MeowScript-Regular",
    textAlign: 'center',
  },
  author: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    fontSize: moderateScale(15),
    textAlign: 'center',
    margin: moderateScale(10),
  },
  infoText: {
    marginTop: verticalScale(25),
    paddingLeft: horizontalScale(25),
    paddingRight: horizontalScale(25),
    textAlign: "center"
  },
  center: {
    alignSelf: "center"
  },
  button: {
    borderWidth: 1,
    borderColor: "#66A182",
    borderRadius: 15,
    paddingLeft: horizontalScale(25),
    paddingRight: horizontalScale(25),
    paddingTop: verticalScale(5),
    paddingBottom: verticalScale(5)
  },
  playBtnContainer: {
    marginTop: verticalScale(30),
    marginBottom: verticalScale(20)
  },
  scrollBottom: {
    borderBottomWidth: 1,
    borderColor: "#66A182"
  },
  status: {
    fontSize: moderateScale(24),
    color: "#fff",
    fontFamily: "Poppins-Light"
  },
  statusContainer: {
    height: verticalScale(150),
    justifyContent: "center",
    alignItems: "center",
  },
  throwBtn: {
    borderColor: "#66A182",
    width: horizontalScale(250),
    height: verticalScale(50),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    marginTop: verticalScale(50)
  },
  throwBtnText: {
    color: "#fff",
    fontSize: moderateScale(20),
    fontFamily: "Poppins-Light"
  },
  dices: {
    marginTop: verticalScale(50)
  },
  points: {
    marginTop: verticalScale(20)
  },
  tableRow: {
    borderBottomColor: "#66A182",
    color: "#fff"
  }
})