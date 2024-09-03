import React, { useState } from 'react';
import { storage, db } from '../../../Firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { Button, Input } from 'antd';
import { getAuth } from 'firebase/auth';

function LogoUpload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const user = getAuth().currentUser;
    const adminId = user.uid;

    try {
      const storageRef = ref(storage, `logos/${adminId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const logoURL = await getDownloadURL(storageRef);

      const adminRef = doc(db, 'Users', adminId);
      await updateDoc(adminRef, { logoURL });

      alert('Logo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Error uploading logo');
    }
  };

  return (
    <div>
      <Input type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload}>Upload Logo</Button>
    </div>
  );
}

export default LogoUpload;
