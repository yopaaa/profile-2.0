import styles from './styles/Marquee.module.css';

const items = ["React", "Next.js", "Node.js", "TypeScript", "Figma", "PostgreSQL", "Docker", "Tailwind"];

export default function Marquee() {
  return (
    <div className={styles.strip}>
      <div className={styles.track}>
        {[...items, ...items, ...items].map((item, idx) => (
          <span key={idx} className={styles.item}>
            {item}
            <span className={styles.sep}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}