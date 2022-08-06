import { systemLogger } from '../logger.js';
import { Storage } from '@google-cloud/storage';

const storage = new Storage({keyFilename: 'key.json'});
const BUCKETNAME = 'liot-intercom';
const CLOUD_STORAGE_URL = 'https://storage.googleapis.com/';

// 日時からファイル名を生成する
export const genFileNameFromDatetime = (ext, date=Date.now()) => {
    const dt = new Date(date);
    return dt.toLocaleString().replace(/[\/\s\:]/g, '_') + '.' + ext;
}

// 画像データを保存して画像へのURLをリターンする（非同期）
export const genImageUrlFromBytes = async (data) => {
    systemLogger.trace('画像データからURLを生成')
    const fileName = genFileNameFromDatetime('jpg');
    const path = 'image/' + fileName;

   uploadFromMemory(path, data);

    const url = CLOUD_STORAGE_URL + BUCKETNAME + '/' + fileName;
    systemLogger.trace('画像データからURLを生成 -> 完了 url: '+url);
    return url;
}

// gcsに画像をアップロード
export const uploadFromMemory = async (destFileName, content) => {
  await storage.bucket(BUCKETNAME).file(destFileName).save(content);
}