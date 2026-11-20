import { NavLink } from 'react-router'
import { PAGES } from '../data/pages'
import { SITE } from '../data/site'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.who}>
          <p className={styles.name}>{SITE.name}</p>
          <p>
            Mã sinh viên {SITE.studentId}
            <br />
            {SITE.major}, {SITE.school}
          </p>
          <p className={styles.course}>Portfolio học phần {SITE.course}</p>
        </div>
        <nav aria-label="Tất cả các trang" className={styles.pages}>
          <ul>
            {PAGES.map((p) => (
              <li key={p.slug}>
                <NavLink to={p.path} end>
                  {p.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
