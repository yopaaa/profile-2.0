import styles from './styles/Marquee.module.css';

const items = [
  "React",
  "Next.js",
  "Node.js",
  "TypeScript",
  "Figma",
  "PostgreSQL",
  "Docker",
  "Tailwind CSS",
];

export default function Marquee() {
  // Triple the items so the loop is seamless
  const repeated = [...items, ...items, ...items];

  return (
    <div className={styles.strip}>
      <div className={styles.track}>
        {repeated.map((item, idx) => (
          <span key={idx} className={styles.item}>
            <span>{item}</span>
            <span className={styles.sep} aria-hidden="true">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}