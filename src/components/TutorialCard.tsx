import Link from 'next/link';
import { Clock, User, Calendar } from 'lucide-react';
import { Tutorial } from '@/types';
import { formatDate } from '@/lib/utils';

interface TutorialCardProps {
  tutorial: Tutorial;
}

export function TutorialCard({ tutorial }: TutorialCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
            <Link 
              href={`/tutorials/${tutorial.slug}`}
              className="hover:text-blue-600 transition-colors"
            >
              {tutorial.title}
            </Link>
          </h3>
          {tutorial.featured && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2">
              推荐
            </span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {tutorial.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tutorial.tags.map((tag) => (
          <span
            key={tag}
            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <User className="w-4 h-4" />
            <span>{tutorial.author}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{tutorial.readTime} 分钟</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(tutorial.publishedAt)}</span>
        </div>
      </div>

      <div className="mt-4">
        <Link
          href={`/tutorials/${tutorial.slug}`}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          阅读全文 →
        </Link>
      </div>
    </article>
  );
}