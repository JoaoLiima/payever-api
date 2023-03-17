import axios from 'axios';
import * as fs from 'fs';

export async function saveAvatar(
  avatarUrl: string,
  userId: number,
): Promise<string> {
  const response = await axios.get(avatarUrl, {
    responseType: 'arraybuffer',
  });

  const fileName = `${userId}.jpg`;
  const folder = `${process.cwd()}/avatars`;
  const path = `${folder}/${fileName}`;

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }

  fs.writeFileSync(`${path}`, response.data);

  return path;
}
