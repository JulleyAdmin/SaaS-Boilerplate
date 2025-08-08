export const DemoBadge = () => (
  <div className="fixed bottom-4 right-4 z-10">
    <div className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white shadow-lg border border-red-700">
      <div className="flex items-center space-x-2">
        <span className="text-red-100">🏥</span>
        <span>Sanjeevani HMS Demo</span>
      </div>
      <div className="text-xs text-red-100 mt-1">
        Emergency: 108 | Ambulance: 102
      </div>
    </div>
  </div>
);
