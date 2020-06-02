import { openDatabase } from 'react-native-sqlite-storage';
// import { action } from 'mobx-react';
import { observable, action } from 'mobx';
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
                this.insertDummyAuthors().then(() => {
                  this.insertDummyNews();
                });
                //  this.loadAuthors();
              },
              (error) => {
                console.log('Error on creation', error);
              }
            );
          } else {
            console.log('Loading');
            this.loadAuthors();
            this.loadNews();
          }
        }
      );
    });
  }

  loadAuthors() {
    this.db.transaction((txn) => {
      txn.executeSql(`SELECT * FROM 'authors'`, [], (_, results) => {
        for (let i = 0; i < results.rows.length; i += 1) {
          const row = results.rows.item(i);
          this.insertStoreAuthor(row.id, row.name, row.enabled);
        }
      });
    });
  }

  getAuthorById(id) {
    for (let i = 0; i < this.authorsList.length; i += 1) {
      const author = this.authorsList[i];
      if (author.id === id) {
        return author;
      }
    }
    return null;
  }

  loadNews() {
    this.db.transaction((txn) => {
      txn.executeSql(`SELECT * FROM 'news'`, [], (_, results) => {
        for (let i = 0; i < results.rows.length; i += 1) {
          const row = results.rows.item(i);
          const author = this.getAuthorById(row.author);
          this.insertStoreNews(
            row.id,
            row.title,
            author,
            row.desc,
            new Date(row.date),
            row.image
          );
        }
      });
    });
  }

  insertStoreNews(lastRowId, title, author, desc, date, imageUrl) {
    this.lastRowNews = lastRowId;
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
  }

  copyImage(imageUri, newName) {
    // If it is a dummy image
    if (imageUri.startsWith('http')) {
      return new Promise((resolve) => resolve(imageUri));
    }

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
        this.newsList.splice(i, 1);
        this.db.transaction((txn) => {
          txn.executeSql(
            `
            DELETE FROM 
              'news'
            WHERE
              id = ?
            ;
            `,
            [id]
          );
        });
        return;
      }
    }
  }

  @action editNews(id, title, author, desc, date, image) {
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
                try {
                  if (!lastImage.startsWith('http')) {
                    RNFS.unlink(lastImage);
                  }
                } catch (error) {
                  console.log('error:', error.toString());
                }
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
                this.insertStoreNews(
                  lastRowId,
                  title,
                  author,
                  desc,
                  date,
                  imageUrl
                );
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

  @action insertStoreAuthor(id, name, enabled) {
    this.authorsList = this.authorsList.concat([
      {
        id,
        name,
        enabled,
      },
    ]);
  }

  @action insertDummyNews() {
    const loremIpsumGibberish =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
    const newsArr = [
      {
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        author: this.getAuthorById(1),
        desc: loremIpsumGibberish,
        date: new Date(2020, 5, 1),
        image:
          'https://images.pexels.com/photos/2568906/pexels-photo-2568906.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      },
      {
        title: 'Consectetur adipiscing elit, sed do eiusmod tempor incididunt',
        author: this.getAuthorById(2),
        desc: loremIpsumGibberish,
        date: new Date(2020, 5, 2),
        image:
          'https://images.pexels.com/photos/897232/pexels-photo-897232.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      },
      {
        title:
          'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
        author: this.getAuthorById(3),
        desc: loremIpsumGibberish,
        date: new Date(2020, 4, 29),
        image:
          'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      },
      {
        title:
          'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris',
        author: this.getAuthorById(4),
        desc: loremIpsumGibberish,
        date: new Date(2020, 5, 2),
        image:
          'https://images.pexels.com/photos/974316/pexels-photo-974316.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      },
    ];
    for (let i = 0; i < newsArr.length; i += 1) {
      const news = newsArr[i];
      this.insertNews(
        news.title,
        news.author,
        news.desc,
        news.date,
        news.image
      );
    }
  }

  @action async insertDummyAuthors() {
    const authors = ['Isabel P', 'Eduardo F', 'Luis M', 'Hugo L', 'Lucas M'];
    const promiseArr = [];
    for (let i = 0; i < authors.length; i += 1) {
      const author = authors[i];
      promiseArr.push(
        new Promise((resolve, reject) => {
          this.db.transaction((txn) => {
            txn.executeSql(
              `INSERT INTO "main"."authors" ("name", "enabled") VALUES (?, '1');`,
              [author],
              (tx) => {
                tx.executeSql(
                  'select last_insert_rowid();',
                  [],
                  (_, result) => {
                    if (result.rows.length) {
                      const lastRowId = result.rows.item(0)[
                        'last_insert_rowid()'
                      ];
                      this.lastRowAuthor = lastRowId;
                      this.insertStoreAuthor(
                        result.rows.item(0)['last_insert_rowid()'],
                        author,
                        1
                      );
                      resolve();
                    }
                  }
                );
              },
              (tx, error) => {
                console.log('Error:', error, tx);
                reject();
              }
            );
          });
        })
      );
    }
    await Promise.all(promiseArr);
  }
}

export default new DatabaseStore();
