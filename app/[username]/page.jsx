import styles from "./page.module.css";
import Image from "next/image";
import { getUsers } from "@/utils/getUsersInfo";
import { notFound } from "next/navigation";

const users = [
  { "username": "yopa", "name": "Yopa Pitra" },
  { "username": "linus", "name": "Linus Dev" }
]


export default async function Home({ params }) {
  const data = await getUsers();
  const { username } = await params;

  const user = users.find(u => u.username === username);

  if (!user) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
          <div className={styles.profile2}>
            <Image
              src="/images/yopa.jpeg"
              alt="Profile"
              // fill
              width={200}
              height={200}
              className={styles.image}
            />
          </div>
        <div className={styles.left}>

          <h1 className={styles.name}>Yopa pitra ramadhani</h1>

          <div className={styles.meta}>
            <span>💼 Fullstack developer</span>
            <span>🌍 Kepulauan Bangka-Belitung, Indonesia</span>
          </div>

          <p className={styles.desc}>
            {data.title}
            Saya adalah mahasiswa teknik jaringan komputer yang memiliki
            keterampilan dalam pemrograman web, IoT, dan komputasi awan. Saya
            sangat antusias dan selalu ingin belajar hal-hal baru di bidang
            teknologi informasi.
          </p>

          <button className={styles.button}>Lihat Lebih Banyak</button>

          <div className={styles.social}>
            <span>
              <a href="http://">
                <Image
                  src="/icon/github.png"
                  alt="Profile"
                  width={20}
                  height={20}
                  // className={styles.image}
                />
              </a>
            </span>
            <span>
              <a href="http://">
                <Image
                  src="/icon/linkedin.png"
                  alt="Profile"
                  width={20}
                  height={20}
                  // className={styles.image}
                />
              </a>
            </span>{" "}
            <span>
              <a href="http://">
                <Image
                  src="/icon/email.png"
                  alt="Profile"
                  width={20}
                  height={20}
                  // className={styles.image}
                />
              </a>
            </span>{" "}
            <span>
              <a href="http://">
                <Image
                  src="/icon/instagram.png"
                  alt="Profile"
                  width={20}
                  height={20}
                  // className={styles.image}
                />
              </a>
            </span>{" "}
            <span>
              <a href="http://">
                <Image
                  src="/icon/twitter.png"
                  alt="Profile"
                  width={20}
                  height={20}
                  // className={styles.image}
                />
              </a>
            </span>
          </div>
        </div>

        <div className={styles.right}>
          <Image
            src="/images/yopa.jpeg"
            alt="Profile"
            fill
            className={styles.image}
          />
        </div>
      </div>
    </div>
  );
}
