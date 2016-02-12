import WebSQL from '../utils/WebSQL';
import SQLite from 'react-native-sqlite-storage';
import _ from 'underscore';
import stringHash from 'string-hash';
import colorgyAPI from '../utils/colorgyAPI';
import THEME from '../constants/THEME';

var migartions = {
  '1.0': 'CREATE TABLE info(ID INTEGER PRIMARY KEY, key TEXT, value TEXT);',
  '1.1': 'CREATE INDEX info_key_index ON info (key);',
  '2.1': 'CREATE TABLE courses(ID INTEGER PRIMARY KEY, organization_code CHARACTER(255), code CHARACTER(255), general_code CHARACTER(255), full_semester TINYINT, year SMALLINT, term TINYINT, name CHARACTER(255), name_en CHARACTER(255), lecturer CHARACTER(255), credits TINYINT, required TINYINT, url CHARACTER(255), website CHARACTER(255), prerequisites CHARACTER(255), day_1 TINYINT, day_2 TINYINT, day_3 TINYINT, day_4 TINYINT, day_5 TINYINT, day_6 TINYINT, day_7 TINYINT, day_8 TINYINT, day_9 TINYINT, period_1 TINYINT, period_2 TINYINT, period_3 TINYINT, period_4 TINYINT, period_5 TINYINT, period_6 TINYINT, period_7 TINYINT, period_8 TINYINT, period_9 TINYINT, location_1 CHARACTER(255), location_2 CHARACTER(255), location_3 CHARACTER(255), location_4 CHARACTER(255), location_5 CHARACTER(255), location_6 CHARACTER(255), location_7 CHARACTER(255), location_8 CHARACTER(255), location_9 CHARACTER(255), students_enrolled SMALLINT);',
  '2.2': 'ALTER TABLE courses ADD COLUMN search_keywords TEXT;',
  '2.3': 'CREATE TABLE period_data(ID INTEGER PRIMARY KEY, organization_code CHARACTER(255), "order" INTEGER, code CHARACTER(255), time CHARACTER(255));',
  '2.4': 'ALTER TABLE courses ADD COLUMN local_data BOOLEAN NOT NULL DEFAULT FALSE;'
};

var courseDatabase = new WebSQL('course', 'course', 3*1024*1024, migartions, SQLite);

courseDatabase.migrate();

var sqlValue = courseDatabase.sqlValue;

courseDatabase.getDataUpdatedTime = (orgCode, courseYear = colorgyAPI.getCurrentYear(), courseTerm = colorgyAPI.getCurrentTerm()) => {

  return courseDatabase.executeSql(`SELECT * FROM info WHERE key = '${orgCode}_${courseYear}_${courseTerm}_courses_updated_at';`).then((r) => {

    if (!r.results.rows.length) return null;
    return parseInt(r.results.rows.item(0).value);
  });
};

courseDatabase.updateData = (orgCode, courseYear = colorgyAPI.getCurrentYear(), courseTerm = colorgyAPI.getCurrentTerm(), progressCallback) => {

  console.log(`courseDatabase: updateData(): updating data...`);

  return new Promise( (updateResolve, updateReject) => {

    // This task is done by a series of promises, we are saving them in an array
    var requestPromises = [];
    var remainingPages = 100;

    function requestAndSaveCourses(url, iterateDoneCallback = () => {}, firstRequest = true) {
      console.log(`courseDatabase: updateData(): fetching ${url}`);

      var pagesCount, totalPages, nextURLMatch;

      // Fire request then deal with it
      var request = colorgyAPI.fetch(url).then((response) => {

        // If the organization has no course data
        if (response.status !== 200) {
          throw response.status;
        }

        pagesCount = parseInt(response.headers.get('x-pages-count'));
        if (firstRequest) remainingPages = pagesCount;
        totalPages = pagesCount;

        // Iterate through each next page
        var link = response.headers.get('link');
        if (link) {
          nextURLMatch = link.match(/<([^>]+)>; ?rel="next"/);

          // if next page given
          if (nextURLMatch && nextURLMatch[1]) {
            // Fire a request to get the page
            requestAndSaveCourses(nextURLMatch[1], iterateDoneCallback, false);

          // or if this is the last page
          } else {
            iterateDoneCallback();
          }
        }

        return response.json();

      }).then((json) => {
        // Parse the data and construct SQL insert query
        var insertSQLValues = [];

        json.forEach(function (course) {
          let searchKeywords = `${course.code} ${course.general_code} ${course.name} ${course.name_en} ${course.lecturer}`;

          insertSQLValues.push(`(
            ${sqlValue(orgCode)},
            ${sqlValue(course.code)},
            ${sqlValue(course.general_code)},
            ${sqlValue(course.full_semester)},
            ${sqlValue(course.year)},
            ${sqlValue(course.term)},
            ${sqlValue(course.name)},
            ${sqlValue(course.name_en)},
            ${sqlValue(course.lecturer)},
            ${sqlValue(course.credits)},
            ${sqlValue(course.required)},
            ${sqlValue(course.url)},
            ${sqlValue(course.website)},
            ${sqlValue(course.prerequisites)},
            ${sqlValue(course.day_1)},
            ${sqlValue(course.day_2)},
            ${sqlValue(course.day_3)},
            ${sqlValue(course.day_4)},
            ${sqlValue(course.day_5)},
            ${sqlValue(course.day_6)},
            ${sqlValue(course.day_7)},
            ${sqlValue(course.day_8)},
            ${sqlValue(course.day_9)},
            ${sqlValue(course.period_1)},
            ${sqlValue(course.period_2)},
            ${sqlValue(course.period_3)},
            ${sqlValue(course.period_4)},
            ${sqlValue(course.period_5)},
            ${sqlValue(course.period_6)},
            ${sqlValue(course.period_7)},
            ${sqlValue(course.period_8)},
            ${sqlValue(course.period_9)},
            ${sqlValue(course.location_1)},
            ${sqlValue(course.location_2)},
            ${sqlValue(course.location_3)},
            ${sqlValue(course.location_4)},
            ${sqlValue(course.location_5)},
            ${sqlValue(course.location_6)},
            ${sqlValue(course.location_7)},
            ${sqlValue(course.location_8)},
            ${sqlValue(course.location_9)},
            ${sqlValue(course.students_enrolled)},
            ${sqlValue(searchKeywords)}
          )`);
        });

        var insertSQL = `INSERT INTO courses (
          organization_code,
          code,
          general_code,
          full_semester,
          year,
          term,
          name,
          name_en,
          lecturer,
          credits,
          required,
          url,
          website,
          prerequisites,
          day_1,
          day_2,
          day_3,
          day_4,
          day_5,
          day_6,
          day_7,
          day_8,
          day_9,
          period_1,
          period_2,
          period_3,
          period_4,
          period_5,
          period_6,
          period_7,
          period_8,
          period_9,
          location_1,
          location_2,
          location_3,
          location_4,
          location_5,
          location_6,
          location_7,
          location_8,
          location_9,
          students_enrolled,
          search_keywords
        ) VALUES ${insertSQLValues.join(', ')}`;

        return new Promise((resolve, reject) => {
          courseDatabase.executeSql(insertSQL)
            .then( () => {
              remainingPages--;
              let progress = (totalPages - remainingPages) / totalPages;
              if (progressCallback) progressCallback(progress);

              resolve();

            }).catch( (e) => {
              throw e;
            });

        }).catch( (e) => {
          console.error(`courseDatabase: updateData(): Error on SQL execution`, e);
          updateReject(e);
        });

      }).catch((e) => {
        console.error(`courseDatabase: updateData(): Error on SQL execution`, e);
        updateReject(e);
      });

      requestPromises.push(request);
      return request;
    }

    // Clear the database and fire first request
    var firstRequestPromise = new Promise( (resolve, reject) => {
      const sql = `DELETE FROM courses WHERE local_data = 0 AND organization_code = ${sqlValue(orgCode)} AND year = ${courseYear} AND term = ${courseTerm}`;
      courseDatabase.executeSql(sql).then(() => {
        requestAndSaveCourses(`/${orgCode.toLowerCase()}/courses?filter[year]=${courseYear}&filter[term]=${courseTerm}&per_page=500`, resolve);
      }).catch((e) => {
        console.error(`courseDatabase: updateData(): Error on clearing database`, e);
      });
    });

    // Get period data
    var periodDataRequestPromise = new Promise( (resolve, reject) => {
      courseDatabase.executeSql(`DELETE FROM period_data WHERE organization_code = ${sqlValue(orgCode)}`)
        .then(() => {
          const url = `/${orgCode.toLowerCase()}/period_data?per_page=500`;
          colorgyAPI.fetch(url).then((response) => {
            if (response.status !== 200) {
              throw response.status;
            }
            return response.json();

          }).then((json) => {
            // Parse the data and construct SQL insert query
            var insertSQLValues = json.map(function (period) {
              return `(
                ${sqlValue(orgCode)},
                ${sqlValue(period.order)},
                ${sqlValue(period.code)},
                ${sqlValue(period.time)}
              )`;
            });

            var insertSQL = `INSERT INTO period_data (
              organization_code,
              "order",
              code,
              time
            ) VALUES ${insertSQLValues.join(', ')}`;

            courseDatabase.executeSql(insertSQL).then(() => {
              resolve();
            }).catch((e) => {
              console.error(`courseDatabase: updateData(): Error on inserting period data`, e);
              updateReject(e);
              reject(e);
            });
          }).catch((e) => {
            console.error(`courseDatabase: updateData(): Error on updating period data`, e);
            reject(e);
          });
        }).catch((e) => {
          console.error(`courseDatabase: updateData(): Error on updating period data`, e);
          reject(e);
        });
    });

    requestPromises.push(periodDataRequestPromise);

    // Wait for all request to be done, then resolve the update
    firstRequestPromise.then(() => {
      Promise.all(requestPromises).then(() => {
        courseDatabase.executeSql(`INSERT OR REPLACE INTO info (ID, key, value) VALUES ((SELECT ID FROM info WHERE key = '${orgCode}_${courseYear}_${courseTerm}_courses_updated_at'), '${orgCode}_${courseYear}_${courseTerm}_courses_updated_at' ,` + (new Date()).getTime() + ")");
        console.log(`courseDatabase: updateData(): Done`);
        updateResolve((new Date()).getTime());

      }).catch((e) => {
        console.error(`courseDatabase: updateData(): Error`, e);
        updateReject(e);
      });

    }).catch((e) => {
      console.error(`courseDatabase: updateData(): Error`, e);
      updateReject(e);
    });
  });
};


courseDatabase.createCourse = (orgCode, course) => {
  if (!course.code) course.code = `${orgCode}-${course.year}-${course.term}-${stringHash(course.name)}-${course.lecturer ? stringHash(course.lecturer) : ''}`;
  if (!course.general_code) course.general_code = course.code;

  var insertSQL = `INSERT INTO courses (
    organization_code,
    year,
    term,
    code,
    general_code,
    name,
    lecturer,
    day_1,
    day_2,
    day_3,
    day_4,
    day_5,
    day_6,
    day_7,
    day_8,
    day_9,
    period_1,
    period_2,
    period_3,
    period_4,
    period_5,
    period_6,
    period_7,
    period_8,
    period_9,
    location_1,
    location_2,
    location_3,
    location_4,
    location_5,
    location_6,
    location_7,
    location_8,
    location_9,
    search_keywords,
    local_data
  ) VALUES (
    ${sqlValue(orgCode)},
    ${sqlValue(course.year)},
    ${sqlValue(course.term)},
    ${sqlValue(course.code)},
    ${sqlValue(course.general_code)},
    ${sqlValue(course.name)},
    ${sqlValue(course.lecturer)},
    ${sqlValue(course.day_1)},
    ${sqlValue(course.day_2)},
    ${sqlValue(course.day_3)},
    ${sqlValue(course.day_4)},
    ${sqlValue(course.day_5)},
    ${sqlValue(course.day_6)},
    ${sqlValue(course.day_7)},
    ${sqlValue(course.day_8)},
    ${sqlValue(course.day_9)},
    ${sqlValue(course.period_1)},
    ${sqlValue(course.period_2)},
    ${sqlValue(course.period_3)},
    ${sqlValue(course.period_4)},
    ${sqlValue(course.period_5)},
    ${sqlValue(course.period_6)},
    ${sqlValue(course.period_7)},
    ${sqlValue(course.period_8)},
    ${sqlValue(course.period_9)},
    ${sqlValue(course.location_1)},
    ${sqlValue(course.location_2)},
    ${sqlValue(course.location_3)},
    ${sqlValue(course.location_4)},
    ${sqlValue(course.location_5)},
    ${sqlValue(course.location_6)},
    ${sqlValue(course.location_7)},
    ${sqlValue(course.location_8)},
    ${sqlValue(course.location_9)},
    ${sqlValue(course.name + course.lecturer)},
    ${sqlValue(true)}
  );`;

  return new Promise((resolve, reject) => {
    courseDatabase.executeSql(insertSQL).then((r) => {
      courseDatabase.findCourses(orgCode, course.code).then((courses) => {
        resolve(courses[course.code]);
      }).catch((e) => {
        console.error(e);
        reject(e);
      });
    }).catch((e) => {
      console.error(e);
      reject(e);
    });
  });
};

courseDatabase.getPeriodData = (orgCode, options = {}) => {
  var { returnObject } = options;

  return new Promise( (resolve, reject) => {
    if (orgCode === 'null') {
      if (returnObject) {
        resolve({
          '1': { order: '1', code: '1' },
          '2': { order: '2', code: '2' },
          '3': { order: '3', code: '3' },
          '4': { order: '4', code: '4' },
          '5': { order: '5', code: '5' },
          '6': { order: '6', code: '6' },
          '7': { order: '7', code: '7' },
          '8': { order: '8', code: '8' },
          '9': { order: '9', code: '9' },
          '10': { order: '10', code: '10' },
          '11': { order: '11', code: '11' },
          '12': { order: '12', code: '12' },
          '13': { order: '13', code: '13' },
          '14': { order: '14', code: '14' },
          '15': { order: '15', code: '15' },
          '16': { order: '16', code: '16' }
        });
      } else {
        resolve([
          { order: '1', code: '1' },
          { order: '2', code: '2' },
          { order: '3', code: '3' },
          { order: '4', code: '4' },
          { order: '5', code: '5' },
          { order: '6', code: '6' },
          { order: '7', code: '7' },
          { order: '8', code: '8' },
          { order: '9', code: '9' },
          { order: '10', code: '10' },
          { order: '11', code: '11' },
          { order: '12', code: '12' },
          { order: '13', code: '13' },
          { order: '14', code: '14' },
          { order: '15', code: '15' },
          { order: '16', code: '16' }
        ]);
      }
      return;
    }
    courseDatabase.executeSql(`
      SELECT * FROM period_data
        WHERE organization_code = ${sqlValue(orgCode)}
    `).then((r) => {
      if (returnObject) {
        var periodData = {};

        if (r.results.rows.length) {
          for (let i=0; i<r.results.rows.length; i++) {
            let row = r.results.rows.item(i);
            periodData[row.order] = row;
          }
        }

      } else {
        var periodData = [];

        if (r.results.rows.length) {
          for (let i=0; i<r.results.rows.length; i++) {
            let row = r.results.rows.item(i);
            periodData.push(row);
          }
        }
      }

      resolve(periodData);
    }).catch((e) => {
      console.error(e);
      reject(e);
    });
  });
};

var parseCourseRows = function(rows, periodData) {
  var courses = {};

  for (let i=0; i<rows.length; i++) {
    let row = (rows.item ? rows.item(i) : rows[i]);
    row.fullSemester = row.full_semester;
    row.studentsEnrolled = row.students_enrolled;
    let times = [];
    for (let i=1; i<10; i++) {
      if (row[`day_${i}`] && row[`period_${i}`]) {
        let day = '';
        let periodCode = '';
        switch (row[`day_${i}`]) {
          case 1:
            day = 'Mon';
            break;
          case 2:
            day = 'Tue';
            break;
          case 3:
            day = 'Wed';
            break;
          case 4:
            day = 'Thu';
            break;
          case 5:
            day = 'Fri';
            break;
          case 6:
            day = 'Sat';
            break;
          case 7:
            day = 'Mon';
            break;
        }
        if (periodData[row[`period_${i}`]]) periodCode = periodData[row[`period_${i}`]].code;
        times.push(day + periodCode);
      }
    }
    row.times = times.join(' ');
    row.timeLocations = times.map((time, i) => {
      if (row[`location_${i}`]) {
        return `${time} (${row[`location_${i}`]})`;
      } else {
        return time;
      }
    });

    let colorCount = THEME.COLOR_PALETTE.length;
    let colorIndex = parseInt((stringHash(row.code) % colorCount));

    row.color = THEME.COLOR_PALETTE[colorIndex];

    courses[row.code] = row;
  }

  return courses;
}

courseDatabase.parseCourseRows = parseCourseRows;

courseDatabase.findCourses = (orgCode, courseCodes) => {
  if (typeof courseCodes === 'string') {
    courseCodes = [courseCodes];
  }

  return new Promise((resolve, reject) => {
    courseDatabase.getPeriodData(orgCode, { returnObject: true }).then( (periodData) => {
      courseDatabase.executeSql(`
        SELECT * FROM courses
        WHERE code IN ('${courseCodes.join("', '")}')
      `).then( (r) => {
        var courses = {};
        if (r.results.rows.length) {
          courses = parseCourseRows(r.results.rows, periodData);
        }
        resolve(courses);
      }).catch((e) => {
        console.error(e);
        reject(e);
      });
    }).catch((e) => {
      console.error(e);
      reject(e);
    });
  });
};

courseDatabase.searchCourse = (orgCode, query, courseYear = colorgyAPI.getCurrentYear(), courseTerm = colorgyAPI.getCurrentTerm()) => {
  query = query.replace(/[ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙㄧㄨㄩㄚㄛㄜㄝㄞㄟㄠㄡㄢㄣㄤㄥㄦˊˇˋ˙]/mg, '');

  return new Promise((resolve, reject) => {
    if (query.length < 2) {
      resolve({});
      return;
    }

    courseDatabase.getPeriodData(orgCode, { returnObject: true }).then( (periodData) => {
      courseDatabase.executeSql(`
        SELECT * FROM courses
          WHERE year = ${sqlValue(courseYear)}
            AND term = ${sqlValue(courseTerm)}
            AND organization_code = ${sqlValue(orgCode)}
            AND search_keywords LIKE '%${query}%'
          LIMIT 25
      `).then( (r) => {
        var courses = {};
        if (r.results.rows.length) {
          for (let i=0; i<r.results.rows.length; i++) {
            courses = parseCourseRows(r.results.rows, periodData);
          }
        }
        resolve(courses);
      }).catch((e) => {
        console.error(e);
        reject(e);
      });

    }).catch((e) => {
      console.error(e);
      reject(e);
    });
  });
};

export default courseDatabase;
