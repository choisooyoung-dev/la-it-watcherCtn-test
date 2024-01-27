//채널아이디 값 가져오기
const channelId = window.location.pathname.slice(9);

//채널정보 보기버튼 클릭시
document.querySelector('#channelManagement').addEventListener('click', writeChannelInfo);

function writeChannelInfo(e) {
    e.preventDefault();

    document.querySelector('.channelInfoContainer').setAttribute('hidden', true);
    document.querySelector('.homeBox').setAttribute('hidden', true);
    document.querySelector('.channelInfoSettingContainer').removeAttribute('hidden');
    document.querySelector('#channelSettingForm').addEventListener('submit', sendChannelInfoData);
    document.querySelector('#streamKeyGetNew').addEventListener('click', changeStreamKey);
}

// 폼데이터 전송.
async function sendChannelInfoData(e) {
    e.preventDefault();

    const getAccessToken = getCookie('Authorization');
    const AccessToken = `${getAccessToken}`;
    let saveImageUrlData;
    const formData = new FormData(this);

    let formDataObj = {};
    for (let [key, value] of formData.entries()) {
        formDataObj[key] = value;
    }

    //s3저장소에 이미지 넣기
    saveImageUrlData = await saveImageS3(channelId, formData, AccessToken);

    //channel info 데이터 넣기
    await saveChannelInfoData(channelId, saveImageUrlData, formDataObj, AccessToken);

    //location.reload();

    const url = `${URL}/my-page/${channelId}`;
    window.location.href = url;
    location.reload();

    document.querySelector('.channelInfoContainer').removeAttribute('hidden');
    document.querySelector('.homeBox').removeAttribute('hidden');
    document.querySelector('.channelInfoSettingContainer').setAttribute('hidden', true);
}

//s3에 이미지 저장함수
async function saveImageS3(channelId, formData, AccessToken) {
    return await axios
        .post(`${URL}/api/setting/${channelId}`, formData, {
            withCredentials: true,
            headers: {
                authorization: AccessToken,
            },
        })
        .then((response) => {
            console.log('response', response.data.data);
            return response.data.data;
        });
}

//channel info 데이터 저장
async function saveChannelInfoData(channelId, saveImageUrlData, formDataObj, AccessToken) {
    return await axios
        .put(
            `${URL}/api/channel/info/${channelId}`,
            {
                channelImage: saveImageUrlData,
                channelName: formDataObj.channelName,
                description: formDataObj.channelDescription,
            },
            {
                withCredentials: true,
                headers: {
                    authorization: AccessToken,
                },
            },
        )
        .then((response) => {
            console.log('response', response);
        });
}

//스트림키 재발급
async function changeStreamKey(e) {
    e.preventDefault();
    console.log('스트림키 바꿀예정이에유');
    return await axios
        .put(`${URL}/api/channel/change-key/${channelId}`, {
            withCredentials: true,
            headers: {
                authorization: AccessToken,
            },
        })
        .then((response) => {
            console.log(response);
        });
}
