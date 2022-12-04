const admin = require("firebase-admin");
const storage = admin.storage();

const deleteStorageFolder = async (path) => {
  const options = { prefix: path };
  const [files] = await storage.bucket().getFiles(options);
  console.log(files);
  files.forEach((file) => {
    file.delete();
  });
};

module.exports = {
  deleteStorageFolder,
};
