import React, {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';

let CourseCard = React.createClass({
  propTypes: {
    code: React.PropTypes.string,
    name: React.PropTypes.string,
    lecturer: React.PropTypes.string,
    credits: React.PropTypes.string,
    time: React.PropTypes.string
  },

  getDefaultProps() {
  },

  _handlePress() {
  },

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Text style={styles.titleText}>設計史</Text>
          <TouchableOpacity style={{ borderWidth: 1, borderColor: '#F89680', borderRadius: 2, paddingTop: 2, paddingBottom: 2, paddingLeft: 8, paddingRight: 8 }}>
            <Text style={{ textAlign:'center', color:'#F89680' }}>刪除</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.detailsRow}>
          <View style={styles.detailsItem}>
            <View style={styles.detailsItemIcon}>
              <Image
                style={{ width: 18, height: 18 }}
                source={require('../assets/images/icon_lecturer_grey.png')}
              />
            </View>
            <Text style={styles.detailsItemText}>王大明</Text>
          </View>
          <View style={styles.detailsItem}>
            <View style={styles.detailsItemIcon}>
              <Image
                style={{ width: 18, height: 18 }}
                source={require('../assets/images/icon_code_grey.png')}
              />
            </View>
            <Text style={styles.detailsItemText}>C222211111</Text>
          </View>
          <View style={styles.detailsItem}>
            <View style={styles.detailsItemIcon}>
              <Image
                style={{ width: 18, height: 18 }}
                source={require('../assets/images/icon_time_grey.png')}
              />
            </View>
            <Text style={styles.detailsItemText}>Wed345</Text>
          </View>
        </View>
      </View>
    );
  }
});

let styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 15,
    marginRight: 15,
    paddingTop: 4,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    borderLeftWidth: 2,
    borderLeftColor: '#50E3C2'
  },
  title: {
    paddingTop: 15,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  titleText: {
    fontSize: 20
  },
  detailsRow: {
    flexDirection: 'row'
  },
  detailsItem: {
    flex: 1,
    justifyContent: 'center'
  },
  detailsItemText: {
    textAlign: 'center'
  },
  detailsItemIcon: {
    alignItems: 'center',
    marginBottom: 8
  }
});

export default CourseCard;
