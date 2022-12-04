const functions = require("firebase-functions");
const { elastic, engineName } = require("./elastic");

exports.searchVideos = functions
  .region("us-west3")
  .https.onCall(async (data, context) => {
    const query = data.query;

    const searchFields = { title: {}, user_name: {}, description: {} };
    const resultFields = {
      id: { raw: {} },
      title: { raw: {} },
      date_created: { raw: {} },
      description: { raw: {} },
      duration: { raw: {} },
      exclusive: { raw: {} },
      file_name: { raw: {} },
      title: { raw: {} },
      url: { raw: {} },
      user_id: { raw: {} },
      user_name: { raw: {} },
      views: { raw: {} },
      thumb_url: { raw: {} },
      thumb_file_name: { raw: {} },
      user_photo_url: { raw: {} },
    };
    const options = {
      search_fields: searchFields,
      result_fields: resultFields,
    };

    const resp = await elastic.search(engineName, query, options);
    const camelCaseResults = resp.results.map((doc) => {
      const {
        id,
        date_created,
        description,
        duration,
        exclusive,
        file_name,
        title,
        url,
        user_id,
        user_name,
        views,
        thumb_url,
        thumb_file_name,
        user_photo_url,
      } = doc;
      return {
        docId: id?.raw,
        dateCreated: date_created?.raw,
        description: description?.raw,
        duration: duration?.raw,
        exclusive: exclusive?.raw === "true",
        fileName: file_name?.raw,
        title: title?.raw,
        url: url?.raw,
        userId: user_id?.raw,
        userName: user_name?.raw,
        views: views?.raw,
        thumbUrl: thumb_url?.raw,
        thumbFileName: thumb_file_name?.raw,
        userPhotoURL: user_photo_url?.raw,
      };
    });
    return camelCaseResults;
  });
