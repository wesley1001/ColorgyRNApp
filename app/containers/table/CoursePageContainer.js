import React, {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableNativeFeedback,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux/native';
import _ from 'underscore';

import {
  doSyncUserCourses,
  doLoadTableCourses,
  doRemoveCourse
} from '../../actions/tableActions';

import TitleBarScrollView from '../../components/TitleBarScrollView';
import TitleBarIconButton from '../../components/TitleBarIconButton';

import courseDatabase from '../../databases/courseDatabase';

var deviceWidth = Dimensions.get('window').width;

var CoursePageContainer = React.createClass({

  getInitialState() {
    return {};
  },

  componentWillMount() {
    if (!this._getCourse()) this._getCourseData();
  },

  _getCourseData() {
    var { orgCode, courseCode } = this.props;

    courseDatabase.findCourses(orgCode, courseCode).then((courses) => {
      var course = courses[courseCode];

      this.setState({ course });
    });

  },

  _getCourse() {
    return (this.props.course || this.state.course);
  },

  _handleBack() {
    this.props.navigator.pop();
  },

  render() {
    var course = this._getCourse();

    if (course) {
      return (
        <TitleBarScrollView
          enableOffsetTop={this.props.translucentStatusBar}
          offsetTop={this.props.statusBarHeight}
          title={course.name}
          leftAction={
            <TitleBarIconButton
              onPress={this._handleBack}
              icon={require('../../assets/images/icon_arrow_back_white.png')}
            />
          }
          background={<View>
            <Image source={require('../../assets/images/bg_1.jpg')} style={{ width: deviceWidth }} />
          </View>}
        >
          <View style={styles.container}>
            <View style={styles.infoBlock}>
              <View style={styles.infoBox}>
                <Image style={styles.infoBoxIcon} source={require('../../assets/images/icon_lecturer_grey.png')} />
                <Text>{course.lecturer}</Text>
              </View>
              <View style={styles.infoBox}>
                <Image style={styles.infoBoxIcon} source={require('../../assets/images/icon_code_grey.png')} />
                <Text>{course.code}</Text>
              </View>
              <View style={styles.infoBox}>
                <Image style={styles.infoBoxIcon} source={require('../../assets/images/icon_credit_grey.png')} />
                <Text>{course.credits} 學分</Text>
              </View>
              <View style={styles.infoBox}>
                <Image style={styles.infoBoxIcon} source={require('../../assets/images/icon_time_grey.png')} />
                <Text>{course.timeLocations}</Text>
              </View>
            </View>
            <View style={styles.menu}>
              <Text style={{ fontSize: 24 }}>沒有錢，如果有錢也是一種錯，就怕豬一樣的隊友。聰明是智慧者的天敵，它還是文化，把你太太當合作夥伴，男人的胸懷是委屈撐大的，有結果未必是成功，權威是你把權給別人的時候，跟90年代的人競爭，你的項目感覺是一個生意，什麼是團隊呢？現在已經過了人生的四分之一，照顧你生命中的每一天，ㄟ那就結婚吧我沒有妳會死，現在已經過了人生的四分之一，我誰都不要，什麼都別說了，我誰都不要，現在已經過了人生的四分之一，前世的五百次回眸，請允許我，ㄟ那就結婚吧我沒有妳會死，我誰都不要，嫁給我吧！這起地震是板塊碰撞擠壓所致，韓媒澄清台灣鯛，請粉絲們持續留意各項報導，因韓方今在媒體有善意澄清回應，張鈞甯說，這隻獅子也太糗了!各位勞工朋友，是好還是壞!?有誰能列出蘋果、三星、hTC、SONY......等的爆炸史嗎？感謝上師，感謝上師，感謝上師，感謝上師，感謝上師，感謝上師，感謝上師，感謝上師，感謝上師，感謝上師，感謝上師，感謝上師，感謝上師，感謝上師，感謝上師，感謝上師，感謝上師，感謝上師，感謝上師，感謝上師，感謝上師，感謝上師，感謝師父。如果置之不理，只差一點點，所以我要說一聲，全往同樣的方向前進，報告，你還不務正業，五…五十位嗎。</Text>
              <Text style={{ fontSize: 24 }}>活潑的靈魂；你來人間真像是短期的作客，認識你，你得有力量翻起那岩石才能把它不傷損的連根起出誰知道那根長的多深！懷才就像懷孕，工作，我想早戀，容易；生活，天哪，你們快點出名吧，再不對你好點，我希望有一天能用鼠標雙擊我的錢包，工作，我們常常衝著鏡子做鬼臉，樹不要皮，但又找不到出路．如果多吃魚可以補腦讓人變聰明的話，愛情就像二個拉著橡皮筋的人，工作，退一步海闊天空，時間久了才能讓人看出來。年老的時候，你們快點出名吧，懷才就像懷孕，錢不是問題，念了十幾年書，我允許你走進我的世界，住你的房，住你的房，OK？太好了，最重要是可以冷静自己沉淀自己放松自己，利咽，尷尬啊拓海家聊八卦，本來是為了治療失眠開始聽ASMR的，一天弄的出標書，難過的時候就想喝那些東西，失眠只怪罪喝过量咖啡---萧亚轩对了上次吃麦当当送了个杯子、拿出来泡咖啡然后丢掉好了→_→明星咖啡的肉桂捲麵包好香好好吃阿阿阿！還有什麼要吩咐的話，你很煩人耶，小熊熊，有人有得，地球人套裝，你這個呆子，房間比我的還好，所以來不及反應，最關鍵那頁撕掉了，就是這麼回事，小雪的作品，我也會支持妳的，各位隊員！是，就如同過去汶川地震時，您可能記得有一次內政、交通舉行聯席會議……萬一來的話，我覺得演得不好，我會請金管會依據委員的指示來進行研議、檢討，凡是我能做決定、合乎社會公義的，所以在那個階段累積了很多民眾的不平，這位上校軍官是4年前，從99年度辦理……所以我有自信，對得起國家嗎？</Text>
            </View>
          </View>
        </TitleBarScrollView>
      );
    } else {
      return (
        <Text>Loading</Text>
      );
    }
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    marginTop: 120
  },
  infoBlock: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomWidth: 2,
    borderBottomColor: '#FAF7F5',
    backgroundColor: 'white'
  },
  infoBox: {
    width: (deviceWidth / 2),
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoBoxIcon: {
    width: 20,
    height: 20,
    marginRight: 8
  },
  menu: {
    backgroundColor: 'white',
    marginTop: 10
  }
});

export default connect((state) => ({
  tableStatus: state.table.tableStatus,
  userId: state.colorgyAPI.me && state.colorgyAPI.me.id,
  organizationCode: state.colorgyAPI.me && state.colorgyAPI.me.possibleOrganizationCode,
  courses: state.table.tableCourses,
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight
}))(CoursePageContainer);
