export default function Heading({ title, subtitle }) {
  return (
    <div className="text-center space-y-3 mb-6">
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm sm:text-base  max-w-2xl mx-auto">{subtitle}</p>
    </div>
  );
}
