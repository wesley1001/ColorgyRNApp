import WebSQL from '../utils/WebSQL';
import SQLite from 'react-native-sqlite-storage';
import colorgyAPI from '../utils/colorgyAPI';
import courseDatabase from './courseDatabase';

var migartions = {
  '1.0': 'CREATE TABLE user_courses(ID INTEGER PRIMARY KEY, uuid CHARACTER(255), user_id INTEGER, course_code CHARACTER(255), course_organization_code CHARACTER(255), year INTEGER, term INTEGER, deleted_at DATETIME, synced_at DATETIME);'
};

var tableDatabase = new WebSQL('table', 'table', 3*1024*1024, migartions, SQLite);

tableDatabase.migrate();

var sqlValue = tableDatabase.sqlValue;

tableDatabase.syncUserCourses = (userID, orgCode, year = colorgyAPI.getCurrentYear(), term = colorgyAPI.getCurrentTerm()) => {

  return new Promise( (syncResolve, syncReject) => {
    // Get scoped data from DB
    tableDatabase.executeSql(`
      SELECT * FROM user_courses
        WHERE user_id = ${sqlValue(userID)}
          AND course_organization_code = ${sqlValue(orgCode)}
          AND year = ${sqlValue(year)}
          AND term = ${sqlValue(term)};`).then( (r) => {

      // Convert the results into an array
      var localDataCollection = [];
      if (r.results.rows.length) {
        for (let i=0; i<r.results.rows.length; i++) {
          let row = r.results.rows.item(i);
          localDataCollection.push(row);
        }
      }

      return localDataCollection;

    }).then((localDataCollection) => {

      // Map the local data array into an object using its uuid as key
      var localDataCollectionObject = localDataCollection.reduce( (obj, item) => { obj[item.uuid] = item; return obj; }, {});

      // Get the remote data collection
      var remoteDataCollectionURL = `/v1/me/user_courses.json?per_page=1000&filter[course_organization_code]=${orgCode}&filter[year]=${year}&filter[term]=${term}`;

      colorgyAPI.fetch(remoteDataCollectionURL).then((response) => {
        if (response.status !== 200) {
          throw response.status;
        }

        return response.json();
      }).then((json) => {

        console.log('CC+', json, remoteDataCollectionURL)

        // Parse remote json
        var remoteDataCollection = json.map((item) => {
          if (item.updated_at) item.updated_at = (new Date(item.updated_at)).getTime();
          if (item.created_at) item.created_at = (new Date(item.created_at)).getTime();
          return item;
        });

        // Clone the remoteDataCollection to record the finalDataCollection
        var finalDataCollection = remoteDataCollection.slice(0);

        // Map the remote data array into an object using its uuid as key
        var remoteDataCollectionObject = remoteDataCollection.reduce( (obj, item) => { obj[item.uuid] = item; return obj; }, {});

        // Filter out data that should be deleted on the remote server, and to be restore locally
        var deleteIDsOnRemote = localDataCollection.filter((data) => {
          var remoteData = remoteDataCollectionObject[data.uuid];

          return (data.deleted_at &&
                  remoteData &&
                  (!remoteData.updated_at ||
                   remoteData.updated_at < data.deleted_at));

        }).map((data) => data.uuid);

        finalDataCollection = finalDataCollection.filter((data) => deleteIDsOnRemote.indexOf(data.uuid) < 0);

        var restoreIDsOnLocal = localDataCollection.filter((data) => {
          var remoteData = remoteDataCollectionObject[data.uuid];

          return (data.deleted_at &&
                  remoteData &&
                  (remoteData.updated_at &&
                   remoteData.updated_at > data.deleted_at));

        }).map((data) => data.uuid);

        // Filter out data that should be created on remote
        var newLocalData = localDataCollection.filter((data) => !data.synced_at);

        finalDataCollection = finalDataCollection.concat(newLocalData);

        console.log('tableDatabase: syncUserCourses: final data: ', finalDataCollection);

        // Do update to remote
        var remoteDeletePromise = new Promise((resolve, reject) => {

          colorgyAPI.fetch(`/me/user_courses.json?filter[uuid]=${deleteIDsOnRemote.join(',')}`, {
            method: 'DELETE',
            headers: {
              'Accept': 'application/json'
            }
          }).then((response) => {
            if (parseInt(response.status / 100) === 2) {
              resolve(response);
            } else {
              reject(response);
            }
          }).catch((e) => {
            reject(e);
          });
        });

        var remoteCreatePromise = newLocalData.reduce((promise, data) => promise.then(new Promise((resolve, reject) => {

          colorgyAPI.fetch(`/v1/me/user_courses/${data.uuid}.json`, {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user_courses: data
            })
          }).then((response) => {
            if (parseInt(response.status / 100) === 2) {
              resolve(response);
            } else {
              reject(response);
            }
          }).catch((e) => {
            reject(e);
          });

        })), Promise.resolve());

        var insertSQLValues = [];
        finalDataCollection.forEach(function (data) {
          let updatedAt = (new Date()).getTime();

          insertSQLValues.push(`(
            ${sqlValue(data.uuid)},
            ${sqlValue(data.user_id)},
            ${sqlValue(data.year)},
            ${sqlValue(data.term)},
            ${sqlValue(data.course_organization_code)},
            ${sqlValue(data.course_code)},
            ${sqlValue(updatedAt)}
          )`);
        });

        var insertSQL = `
          INSERT INTO user_courses (
            uuid,
            user_id,
            year,
            term,
            course_organization_code,
            course_code,
            synced_at
          ) VALUES ${insertSQLValues.join(', ')};`;

        var localUpdatePromise = new Promise( (resolve, reject) => {
          tableDatabase.executeSql(`
            DELETE FROM user_courses
              WHERE user_id = ${sqlValue(userID)}
                AND course_organization_code = ${sqlValue(orgCode)}
                AND year = ${sqlValue(year)}
                AND term = ${sqlValue(term)};
          `).then(() => insertSQLValues.length ? tableDatabase.executeSql(insertSQL) : true).then(() => {
            resolve();
          }).catch((e) => {
            reject(e);
          });
        });

        Promise.all([remoteDeletePromise, remoteCreatePromise, localUpdatePromise]).then( () => {
          syncResolve();
        }).catch((e) => {
          console.error(e);
          syncReject(e);
        });

      }).catch( (e) => {
        console.error(e);
        syncReject(e);
      });

    }).catch( (e) => {
      console.error(e);
      syncReject(e);
    });
  });
}

tableDatabase.findUserCourses = (userID, orgCode, year = colorgyAPI.getCurrentYear(), term = colorgyAPI.getCurrentTerm()) => {

  return new Promise((resolve, reject) => {
    tableDatabase.executeSql(`
      SELECT * FROM user_courses
        WHERE user_id = ${sqlValue(userID)}
          AND course_organization_code = ${sqlValue(orgCode)}
          AND year = ${sqlValue(year)}
          AND term = ${sqlValue(term)}
          AND deleted_at IS NULL;
    `).then( (r) => {
      var userCourses = [];
      if (r.results.rows.length) {
        for (let i=0; i<r.results.rows.length; i++) {
          let row = r.results.rows.item(i);
          userCourses.push(row);
        }
      }
      resolve(userCourses);
    }).catch((e) => {
      console.error(e);
      reject(e);
    })
  });
}

tableDatabase.findCourses = (userID, orgCode, year = colorgyAPI.getCurrentYear(), term = colorgyAPI.getCurrentTerm()) => {

  return new Promise((resolve, reject) => {
    tableDatabase.findUserCourses(userID, orgCode, year, term).then( (userCourses) => {

      if (userCourses) {
        courseDatabase.findCourses(orgCode, userCourses.map((c) => c.course_code)).then((courses) => {
          resolve(courses);
        }).catch((e) => {
          reject(e);
        });
      } else {
        resolve({});
      }

    }).catch((e) => {
      reject(e);
    });
  });
}

tableDatabase.addUserCourse = (code, userID, orgCode, year = colorgyAPI.getCurrentYear(), term = colorgyAPI.getCurrentTerm()) => {

  var uuid = `${userID}-${year}-${term}-${orgCode}-${code}`;

  return new Promise( (resolve, reject) => {
    tableDatabase.executeSql(`
      DELETE FROM user_courses
        WHERE user_id = ${sqlValue(userID)}
          AND year = ${sqlValue(year)}
          AND term = ${sqlValue(term)}
          AND course_organization_code = ${sqlValue(orgCode)}
          AND course_code = ${sqlValue(code)};
    `,).then((r) => {
      tableDatabase.executeSql(`
        INSERT INTO user_courses (
          uuid,
          user_id,
          year,
          term,
          course_organization_code,
          course_code
        ) VALUES (
          ${sqlValue(uuid)},
          ${sqlValue(userID)},
          ${sqlValue(year)},
          ${sqlValue(term)},
          ${sqlValue(orgCode)},
          ${sqlValue(code)}
        );
      `).then((r) => {
        resolve();
      }).catch((e) => {
        reject(e);
      });

    }).catch((e) => {
      reject(e);
    });
  });
}

tableDatabase.removeUserCourse = (code, userID, orgCode, year = colorgyAPI.getCurrentYear(), term = colorgyAPI.getCurrentTerm()) => {
  var now = (new Date()).getTime();

  return new Promise((resolve, reject) => {
    tableDatabase.executeSql(`
      UPDATE user_courses SET deleted_at = ${sqlValue(now)}
        WHERE user_id = ${sqlValue(userID)}
          AND year = ${sqlValue(year)}
          AND term = ${sqlValue(term)}
          AND course_organization_code = ${sqlValue(orgCode)}
          AND course_code = ${sqlValue(code)};
    `).then((r) => {
      resolve();
    }).catch((e) => {
      reject(e);
    });
  });
}

export default tableDatabase;
