import { openDatabase } from 'react-native-sqlite-storage';
// import { action } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import RNFS from 'react-native-fs';

class DatabaseStore {
  @observable authorsList = [];

  @observable newsList = [];
  // store variables

  constructor() {
    this.lastRowNews = 0;
    this.lastRowAuthor = 0;
    this.dbConfig = { name: 'NewsDatabase.db' };
    this.db = openDatabase(this.dbConfig);
    this.db.transaction((txn) => {
      txn.executeSql(`DROP TABLE IF EXISTS "news"`, []);
      txn.executeSql(`DROP TABLE IF EXISTS "authors"`, []);
      txn.executeSql(
        `SELECT name FROM sqlite_master WHERE type='table' AND ( name='news' or name='authors')`,
        [],
        (tx, results) => {
          if (results.rows.length <= 1) {
            txn.executeSql(
              `
              CREATE TABLE IF NOT EXISTS "authors" (
                "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
                "name"	TEXT NOT NULL,
                "enabled"	INTEGER NOT NULL
              )
              `,
              []
            );
            txn.executeSql(
              `
              CREATE TABLE IF NOT EXISTS "news" (
                "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
                "title"	TEXT NOT NULL,
                "author"	INTEGER NOT NULL,
                "desc"	TEXT,
                "date"	TEXT NOT NULL,
                "image"	TEXT NOT NULL
              )
              `,
              [],
              () => {
                console.log('Sucessfully created');
                this.insertDummyAuthors();
              },
              (error) => {
                console.log('Error on creation', error);
              }
            );
          }
        }
      );
    });
  }

  copyImage(imageUri, newName) {
    const imagePath = `${RNFS.DocumentDirectoryPath}/images/`;
    const lastDir = imageUri.split('/');
    const extension = /(?:\.([^.]+))?$/.exec(lastDir[lastDir.length - 1])[1];
    return new Promise((resolve, reject) => {
      RNFS.mkdir(imagePath).then(
        () => {
          let newImageUri = `${
            imagePath + newName
          }_${(+new Date()).toString()}`;
          if (extension) {
            newImageUri += `.${extension}`;
          }
          RNFS.copyFile(imageUri, newImageUri).then(
            () => {
              resolve(`file://${newImageUri}`);
            },
            (reason) => {
              console.log('Error on copy:', reason);
              reject(Error('Error on copy:', reason));
            }
          );
        },
        (reason) => {
          console.log('Not created', reason);
          reject(Error('Not created:', reason));
        }
      );
    });
  }

  @action removeNews(id) {
    for (let i = 0; i < this.newsList.length; i += 1) {
      const newsItem = this.newsList[i];
      if (id === newsItem.id) {
        this.db.transaction((txn) => {
          txn.executeSql(
            `
            DELETE FROM 
              'news'
            WHERE
              id = ?
            ;
            `,
            [id],
            () => {
              this.newsList.splice(i, 1);
            }
          );
        });
      }
    }
  }

  @action editNews(id, title, author, desc, date, image) {
    console.log('image', image);
    for (let i = 0; i < this.newsList.length; i += 1) {
      const newsItem = this.newsList[i];
      if (newsItem.id === id) {
        const lastImage = newsItem.image;
        this.copyImage(image, id).then((imageResult) => {
          this.db.transaction((txn) => {
            txn.executeSql(
              `
              UPDATE
                'news'
              SET 
                title = ?,
                author = ?,
                desc = ?,
                date = ?,
                image = ?
              WHERE id = ?
              `,
              [title, author.id, desc, date.toString(), imageResult, id],
              () => {
                this.newsList.splice(i, 1, {
                  id,
                  title,
                  author,
                  desc,
                  date,
                  image: imageResult,
                });
                RNFS.unlink(lastImage);
              },
              (tx, error) => console.log('error:', tx, error)
            );
          });
        });
        return;
      }
    }
  }

  @action sortNews() {
    if (this.newsList.length > 1) {
      this.newsList = this.newsList.slice().sort((a, b) => {
        const keyA = new Date(a.date);
        const keyB = new Date(b.date);

        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      });
    }
  }

  @action insertNews(title, author, desc, date, image) {
    this.copyImage(image, this.lastRowNews + 1).then((imageUrl) => {
      this.db.transaction((txn) => {
        txn.executeSql(
          `
          INSERT INTO "main"."news"
          ("title", "author", "desc", "date", "image")
          VALUES (?, ?, ?, ?, ?);
          `,
          [title, author.id, desc, date.toString(), imageUrl],
          (tx) => {
            tx.executeSql('select last_insert_rowid();', [], (_, result) => {
              if (result.rows.length) {
                const lastRowId = result.rows.item(0)['last_insert_rowid()'];
                this.lastRowNews = lastRowId;
                console.log(result.rows.item(0)['last_insert_rowid()']);
                this.newsList = this.newsList.concat([
                  {
                    id: lastRowId,
                    title,
                    author,
                    desc,
                    date,
                    image: imageUrl,
                  },
                ]);
                this.sortNews();
              }
            });
            return true;
          },
          (tx, error) => {
            console.log('Error:', error, tx);
          }
        );
      });
    });
  }

  @action insertAuthor(id, name, enabled) {
    this.authorsList = this.authorsList.concat([
      {
        id,
        name,
        enabled,
      },
    ]);
  }

  @action insertDummyAuthors() {
    const authors = ['Isabel P', 'Eduardo F', 'Luis M', 'Hugo L', 'Lucas M'];
    authors.map((author) => {
      this.db.transaction((txn) => {
        txn.executeSql(
          `INSERT INTO "main"."authors" ("name", "enabled") VALUES (?, '1');`,
          [author],
          (tx) => {
            tx.executeSql('select last_insert_rowid();', [], (_, result) => {
              if (result.rows.length) {
                const lastRowId = result.rows.item(0)['last_insert_rowid()'];
                this.lastRowAuthor = lastRowId;
                console.log('author:', lastRowId);
                this.insertAuthor(
                  result.rows.item(0)['last_insert_rowid()'],
                  author,
                  1
                );
              }
            });
          },
          (tx, error) => {
            console.log('Error:', error, tx);
          }
        );
      });
    });
  }
}

export default new DatabaseStore();
