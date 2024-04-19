import React from 'react';

// Utility function for class name combinations
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Tabs ({ tabs, onTabChange, currentTab, showIcons = true, showBadge = true }) {
  return (
    <div>
      {/* Mobile view: Dropdown */}
      <div className="sm:hidden">
        <select
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          onChange={(e) => onTabChange(e.target.value)}
          value={currentTab}
        >
          {tabs.map((tab) => (
            <option key={tab.name} value={tab.name}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      {/* Desktop view: Tabs */}
      <div className="hidden sm:block">
        <nav className="border-b border-gray-200">
          <div className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => onTabChange(tab.name)}
                className={classNames(
                  tab.name === currentTab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium focus:outline-none'
                )}
                aria-current={tab.name === currentTab ? 'page' : undefined}
              >
                {showIcons && tab.icon && (
                  <tab.icon
                    className={classNames(
                      tab.name === currentTab ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500',
                      '-ml-0.5 mr-2 h-5 w-5'
                    )}
                    aria-hidden="true"
                  />
                )}
                {tab.name}
                {showBadge && tab.badge && (
                  <span
                    className={classNames(
                      tab.name === currentTab ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                      'ml-3 rounded-full py-0.5 px-2.5 text-xs font-medium'
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

