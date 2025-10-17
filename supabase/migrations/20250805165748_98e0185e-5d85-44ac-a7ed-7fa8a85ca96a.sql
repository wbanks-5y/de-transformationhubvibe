-- Clean up existing rejected insights
DELETE FROM analyst_insights 
WHERE approval_status = 'rejected';