import s3 from '../../s3-settings';

const store = new FS.Store.S3('storage', s3);

const storage = new FS.Collection('storage', {
  stores: [store],
});

export default storage;