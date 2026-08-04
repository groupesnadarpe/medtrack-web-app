import {
  BarChart3,
  ChevronDown,
  CirclePlus,
  ShieldCheck,
  TrendingUp,
  UserRoundX,
  type LucideIcon,
} from "lucide-react";
import type { AdminDashboardData, DashboardActivity } from "@/features/medtrack-dashboard/domain/dashboard";
import styles from "./admin-dashboard.module.css";

type Props = Readonly<{
  data: AdminDashboardData;
  user: { displayName: string };
}>;

const activityIcons: Record<DashboardActivity["type"], LucideIcon> = {
  institution: CirclePlus,
  user: UserRoundX,
  permission: ShieldCheck,
};

function Metrics({ data }: Pick<Props, "data">) {
  if (data.metrics.length === 0) {
    return <p className={styles.empty}>Aucun indicateur disponible.</p>;
  }

  return (
    <section className={styles.metrics} aria-label="Indicateurs clés">
      {data.metrics.map((metric) => (
        <article key={metric.id} className={`${styles.card} ${styles.metric}`}>
          <div className={styles.metricHeader}>
            <span>{metric.label}</span>
            {metric.trend ? (
              <span className={styles.trend}>
                <TrendingUp aria-hidden="true" />
                {metric.trend}
              </span>
            ) : null}
          </div>
          <strong className={styles.metricValue}>{metric.value}</strong>
        </article>
      ))}
    </section>
  );
}

function RegistrationChart({ data }: Pick<Props, "data">) {
  const maximum = Math.max(1, ...data.registrations.map((item) => item.value));
  const highlighted = data.registrations.reduce<(typeof data.registrations)[number] | null>(
    (current, item) => (!current || item.value > current.value ? item : current),
    null,
  );

  return (
    <article className={`${styles.card} ${styles.panel}`}>
      <div className={styles.panelHeader}>
        <h2>Évolution des inscriptions</h2>
        <label className={styles.period}>
          <span className="sr-only">Période du graphique</span>
          <select defaultValue="30-days" aria-label="Période du graphique">
            <option value="30-days">30 jours</option>
          </select>
          <ChevronDown aria-hidden="true" />
        </label>
      </div>

      <div className={styles.chart} role="img" aria-label="Graphique des inscriptions quotidiennes">
        <div className={styles.axis} aria-hidden="true">
          <span>200</span><span>150</span><span>100</span><span>50</span><span>0</span>
        </div>
        <div className={styles.plot}>
          {highlighted ? (
            <span className={styles.tooltip} aria-hidden="true">
              <strong>{highlighted.value}</strong>
              <small>{highlighted.label}</small>
            </span>
          ) : null}
          <div className={styles.bars}>
            {data.registrations.map((item) => (
              <div key={item.label} className={styles.barColumn}>
                <div
                  className={styles.bar}
                  style={{ height: `${Math.max(10, (item.value / maximum) * 88)}%` }}
                  title={`${item.label} : ${item.value} inscriptions`}
                />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.chartFooter}>
        <span className={styles.pill}><BarChart3 aria-hidden="true" />Moyenne : {data.averageRegistrations} inscriptions/jour</span>
        <span className={`${styles.pill} ${styles.positivePill}`}><TrendingUp aria-hidden="true" />{data.registrationTrend}</span>
      </div>
    </article>
  );
}

function Activities({ data }: Pick<Props, "data">) {
  return (
    <article className={`${styles.card} ${styles.panel}`}>
      <h2 className={styles.panelTitle}>Activités récentes</h2>
      <div className={styles.activityList}>
        {data.activities.length === 0 ? <p className={styles.empty}>Aucune activité récente.</p> : null}
        {data.activities.map((activity) => {
          const Icon = activityIcons[activity.type];
          return (
            <div key={activity.id} className={styles.activity}>
              <span className={`${styles.activityIcon} ${styles[activity.type]}`}>
                <Icon aria-hidden="true" />
              </span>
              <div className={styles.itemContent}>
                <strong>{activity.title}</strong>
                <p>{activity.description}</p>
                <time>{activity.occurredAt}</time>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function Institutions({ data }: Pick<Props, "data">) {
  const maximum = Math.max(1, ...data.institutions.map((item) => item.value));

  return (
    <article className={`${styles.card} ${styles.panel}`}>
      <div className={styles.panelHeader}>
        <h2>Répartition par institution</h2>
        <span className={styles.topFive}>Top 5</span>
      </div>
      <div className={styles.institutionList}>
        {data.institutions.length === 0 ? <p className={styles.empty}>Aucune institution disponible.</p> : null}
        {data.institutions.map((item) => (
          <div key={item.uuid} className={styles.institutionItem}>
            <div className={styles.institutionRow}><span>{item.name}</span><strong>{item.value}</strong></div>
            <div className={styles.track} aria-hidden="true">
              <div className={styles.fill} style={{ width: `${(item.value / maximum) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function Alerts({ data }: Pick<Props, "data">) {
  return (
    <article className={`${styles.card} ${styles.panel}`}>
      <div className={styles.panelHeader}>
        <h2>Alertes système</h2>
        <span className={styles.alertBadge}>{data.alerts.length}</span>
      </div>
      <div className={styles.alertList}>
        {data.alerts.length === 0 ? <p className={styles.empty}>Aucune alerte système.</p> : null}
        {data.alerts.map((alert) => (
          <div key={alert.id} className={styles.alert}>
            <span className={`${styles.dot} ${styles[alert.level]}`} aria-hidden="true" />
            <div className={styles.itemContent}>
              <strong>{alert.title}</strong>
              <p>{alert.description}</p>
              <time>{alert.occurredAt}</time>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

/** Contenu responsive du dashboard ; le Header et la Sidebar sont fournis par ProtectedShell. */
export function AdminDashboard({ data, user }: Props) {
  return (
    <div className={styles.dashboard}>
      <header className={styles.welcome}>
        <h2>Bienvenue, {user.displayName}</h2>
        <p>Aujourd&apos;hui - 12 mars 2026</p>
      </header>
      <Metrics data={data} />
      <section className={styles.primaryGrid}>
        <RegistrationChart data={data} />
        <Activities data={data} />
      </section>
      <section className={styles.secondaryGrid}>
        <Institutions data={data} />
        <Alerts data={data} />
      </section>
    </div>
  );
}