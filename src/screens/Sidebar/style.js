const React = require("react-native");

const { Platform } = React;

const primary = require("../../theme/variables/commonColor").brandPrimary;

export default {
  links: {
    paddingTop: Platform.OS === "android" ? 8 : 10,
    paddingBottom: Platform.OS === "android" ? 8 : 10,
    paddingLeft: Platform.OS === "android" ? 0 : 10,
    borderBottomWidth: Platform.OS === "android" ? 0 : 0,
    borderBottomColor: "transparent"
  },
  linkText: {
    paddingLeft: 15
  },
  sublinks: {
    paddingTop: Platform.OS === "android" ? 4 : 5,
    paddingBottom: Platform.OS === "android" ? 4 : 5,
    paddingLeft: Platform.OS === "android" ? 0 : 10,
    borderBottomWidth: Platform.OS === "android" ? 0 : 0,
    borderBottomColor: "transparent"
  },
  sublinkText: {
    paddingLeft: 38
  },
  sidebarHeaderText: {
    paddingLeft: 15,
    fontWeight: 'bold',
    fontSize: 24,
    flex: 3,
    alignSelf: 'center'
  },
  logoutContainer: {
    padding: 0,
    paddingTop: 0
  },
  logoutbtn: {
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#fff"
  },
  background: {
    flex: 1,
    width: null,
    height: null,
    backgroundColor: primary
  },
  drawerContent: {
    paddingTop: Platform.OS === "android" ? 20 : 30
  },
  profilePic: {
    height: 40,
    width: 40,
    borderRadius: Platform.OS === "android" ? 40 : 20
  },
  orgPic: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
    flex: 1,
    alignSelf: 'center'
  }
};
