import { Op, literal } from "sequelize";

export const buildEventFilters = (query) => {
  const { category, minPrice, maxPrice, location, date } = query;
  const whereClause = {};

 
  if (category) {
    const categories = category.split(',').map(cat => cat.trim());
    if (categories.length === 1) {
      whereClause.category = {
        [Op.iLike]: categories[0]
      };
    } else {
      whereClause.category = {
        [Op.or]: categories.map(cat => ({ [Op.iLike]: cat }))
      };
    }
  }


  if (location) {
    whereClause.location = {
      [Op.iLike]: `%${location}%`
    };
  }


  if (date) {
    const today = new Date();
    let start, end;

    switch(date) {
      case 'Today':
        start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        break;
      case 'Tomorrow':
        start = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
        break;
      case 'This Week':
        start = new Date(today);
        start.setDate(today.getDate() - today.getDay()); // Sunday
        end = new Date(start);
        end.setDate(start.getDate() + 7);
        break;
      case 'This Month':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        break;
      default:
        start = null;
        end = null;
    }

    if (start && end) {
      whereClause.date = {
        [Op.gte]: start,
        [Op.lt]: end
      };
    }
  }

  
  if (minPrice && minPrice !== '' && !isNaN(parseFloat(minPrice))) {
    const minPriceValue = parseFloat(minPrice);
    if (!isNaN(minPriceValue)) {
      whereClause[Op.and] = whereClause[Op.and] || [];
      whereClause[Op.and].push(
        literal(`EXISTS (SELECT 1 FROM jsonb_each_text(prices) WHERE value != '' AND value IS NOT NULL AND value::numeric >= ${minPriceValue})`)
      );
    }
  }
  if (maxPrice && maxPrice !== '' && !isNaN(parseFloat(maxPrice))) {
    const maxPriceValue = parseFloat(maxPrice);
    if (!isNaN(maxPriceValue)) {
      whereClause[Op.and] = whereClause[Op.and] || [];
      whereClause[Op.and].push(
        literal(`EXISTS (SELECT 1 FROM jsonb_each_text(prices) WHERE value != '' AND value IS NOT NULL AND value::numeric <= ${maxPriceValue})`)
      );
    }
  }

  return whereClause;
};
