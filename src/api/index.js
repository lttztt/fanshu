import AV from 'leancloud-storage'

const appId = 'UvLoREvvFpxBNxtNuYCPjWbs-gzGzoHsz';
const appKey = '5GaICyANtnLXd6wUsy9n2LHW';
AV.init({
  appId,
  appKey
});

export default { SDK: AV };
