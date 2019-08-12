import AV from 'leancloud-storage'

// const appId = 'UvLoREvvFpxBNxtNuYCPjWbs-gzGzoHsz';
// const appKey = '5GaICyANtnLXd6wUsy9n2LHW';
const appId = 'TvRqQx6utxu5IELIsi8M94mv-MdYXbMMI';
const appKey = 'KWD1FbHra7rFt1aa6KFH9Dml';
AV.init({
  appId,
  appKey
});

export default { SDK: AV };
