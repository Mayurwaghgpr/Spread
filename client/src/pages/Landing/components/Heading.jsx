export default function Heading({ title, subtitle }) {
  return (
    <div className="text-center space-y-3 mb-6 text-light">
      <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm sm:text-base  max-w-2xl mx-auto">{subtitle}</p>
    </div>
  );
}
