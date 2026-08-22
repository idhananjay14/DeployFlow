interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  sublabel: string;
  color: "purple" | "blue" | "green" | "orange";
}

const StatCard = ({ icon, label, value, sublabel, color }: StatCardProps) => {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className={`stat-card-icon icon-${color}`}>{icon}</div>
        <div>
          <p className="stat-card-label">{label}</p>
          <p className="stat-card-value">{value}</p>
        </div>
      </div>
      <p className="stat-card-sublabel">{sublabel}</p>
    </div>
  );
};

export default StatCard;
