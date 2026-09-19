export default function Heading({ title, subtitle }) {
  return (
    <div className="text-center space-y-3 mb-6">
      <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
        {title}
      </h2>
      <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}
