import WebSQL from '../utils/WebSQL';
import SQLite from 'react-native-sqlite-storage';

var migartions = {
  '1.0': 'CREATE TABLE info(ID INTEGER PRIMARY KEY, key TEXT, value TEXT);',
  '1.1': 'CREATE INDEX info_key_index ON info (key);',
  '2.0': 'CREATE TABLE organizations(ID INTEGER PRIMARY KEY, code CHARACTER(255), name CHARACTER(255), short_name CHARACTER(255));',
  '2.1': 'CREATE INDEX organizations_code_index ON organizations (code);',
  '3.0': 'CREATE TABLE departments(ID INTEGER PRIMARY KEY, organization_code CHARACTER(255), code CHARACTER(255), name CHARACTER(255), short_name CHARACTER(255), parent_code CHARACTER(255), group_code CHARACTER(255));',
  '3.1': 'CREATE INDEX departments_code_index ON departments (code);',
  '3.2': 'CREATE INDEX departments_parent_code_index ON departments (parent_code);',
  '3.3': 'CREATE INDEX departments_group_code_index ON departments (group_code);'
};

var organizationDatabase = new WebSQL('organization', 'organization', 3*1024*1024, migartions, SQLite);

organizationDatabase.migrate();

organizationDatabase.updateOrganization = () => {
  var { sqlValue } = organizationDatabase;

  return colorgyAPI.fetch('/v1/organizations.json?fields=code,name,short_name').then((req) => {
    if (req.status !== 200) throw req.status;
    return req.json();
  }).then((json) => {
    var insertSQLValues = [];
    json.forEach((org) => {
      insertSQLValues.push(`(
        ${sqlValue(org.code)},
        ${sqlValue(org.name)},
        ${sqlValue(org.short_name)}
      )`);
    });

    var insertSQL = `INSERT INTO organizations (
      code,
      name,
      short_name
    ) VALUES ${insertSQLValues.join(', ')}`;

    return insertSQL;

  }).then((insertSQL) => {
    return organizationDatabase.executeSql('DELETE FROM organizations').then((r) => {
      return organizationDatabase.executeSql(insertSQL);
    }).then((r) => {
      organizationDatabase.executeSql(`INSERT OR REPLACE INTO info (ID, key, value) VALUES ((SELECT ID FROM info WHERE key = 'organizations_updated_at'), 'organizations_updated_at', ${(new Date()).getTime()})`);
    });
  });
};

organizationDatabase.updateDepartment = (orgCode) => {
  var { sqlValue } = organizationDatabase;

  return colorgyAPI.fetch(`/v1/organizations/${orgCode}.json?fields[organization]=departments&fields[department]=code,name,short_name`).then((req) => {
    if (req.status !== 200) throw req.status;
    return req.json();
  }).then((json) => {
    var insertSQLValues = [];

    json.departments.forEach((dep) => {
      insertSQLValues.push(`(
        ${sqlValue(orgCode)},
        ${sqlValue(dep.code)},
        ${sqlValue(dep.name)},
        ${sqlValue(dep.short_name)}
      )`);
    });

    var insertSQL = `INSERT INTO departments (
      organization_code,
      code,
      name,
      short_name
    ) VALUES ${insertSQLValues.join(', ')}`;

    return insertSQL;

  }).then((insertSQL) => {
    return organizationDatabase.executeSql('DELETE FROM departments WHERE organization_code = ?;', [orgCode]).then((r) => {
      return organizationDatabase.executeSql(insertSQL);
    }).then((r) => {
      organizationDatabase.executeSql(`INSERT OR REPLACE INTO info (ID, key, value) VALUES ((SELECT ID FROM info WHERE key = 'organization_${orgCode}_updated_at'), '${orgCode}_departments_updated_at', ${(new Date()).getTime()})`);
    });
  });
};

organizationDatabase.getOrganizations = () => {
  return organizationDatabase.executeSql("SELECT * FROM info WHERE key = 'organizations_updated_at'").then( (r) => {
    var hasData = (r.results.rows.length > 0);

    if (hasData && (new Date()).getTime() - parseInt(r.results.rows.item(0).value) < 60*60*1000) {
      return organizationDatabase.executeSql("SELECT * FROM organizations");
    } else {
      return organizationDatabase.updateOrganization().then((r) => {
        return organizationDatabase.executeSql("SELECT * FROM organizations");
      }).catch((e) => {
        if (hasData) {
          return organizationDatabase.executeSql("SELECT * FROM organizations");
        } else {
          throw e;
        }
      });
    }

  }).then((r) => {
    var organizations = [];
    if (r.results.rows.length) {
      for (let i=0; i<r.results.rows.length; i++) {
        let row = r.results.rows.item(i);
        row.shortName = row.short_name;
        organizations.push(row);
      }
    }

    return organizations;
  });
};

organizationDatabase.getDepartments = (orgCode) => {
  var { sqlValue } = organizationDatabase;

  return organizationDatabase.executeSql(`SELECT * FROM info WHERE key = '${orgCode}_departments_updated_at'`).then( (r) => {
    var hasData = (r.results.rows.length > 0);

    if (hasData && (new Date()).getTime() - parseInt(r.results.rows.item(0).value) < 60*60*1000) {
      return organizationDatabase.executeSql(`SELECT * FROM departments WHERE organization_code = ${sqlValue(orgCode)}`);
    } else {
      return organizationDatabase.updateDepartment(orgCode).then((r) => {
        return organizationDatabase.executeSql(`SELECT * FROM departments WHERE organization_code = ${sqlValue(orgCode)}`);
      }).catch((e) => {
        if (hasData) {
          return organizationDatabase.executeSql(`SELECT * FROM departments WHERE organization_code = ${sqlValue(orgCode)}`);
        } else {
          throw e;
        }
      });
    }

  }).then((r) => {
    var departments = [];
    if (r.results.rows.length) {
      for (let i=0; i<r.results.rows.length; i++) {
        let row = r.results.rows.item(i);
        row.shortName = row.short_name;
        departments.push(row);
      }
    }

    return departments;
  });
};

export default organizationDatabase;
