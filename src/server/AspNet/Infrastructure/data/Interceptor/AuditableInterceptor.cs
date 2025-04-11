using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Domain.Common;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Infrastructure.Data.Interceptor
{
    public class AuditableInterceptor : SaveChangesInterceptor
    {
        private readonly IUser _user;
        private readonly TimeProvider _timeProvider;

        public AuditableInterceptor(
            IUser user,
            TimeProvider timeProvider)
        {
            _user = user;
            _timeProvider = timeProvider;
        }

        public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
        {
            UpdateEntities(eventData.Context);
            return base.SavingChanges(eventData, result);
        }

        public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default)
        {
            UpdateEntities(eventData.Context);
            return base.SavingChangesAsync(eventData, result, cancellationToken);
        }

        private void UpdateEntities(Microsoft.EntityFrameworkCore.DbContext? context)
        {
            if (context == null) return;

            var currentUser = _user.getCurrentUser();
            var currentTime = _timeProvider.GetUtcNow().DateTime;

            foreach (var entry in context.ChangeTracker.Entries<AuditableEntity>())
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedBy = currentUser;
                    entry.Entity.CreatedAt = currentTime;
                }

                if (entry.State == EntityState.Modified)
                {
                    entry.Entity.UpdatedBy = currentUser;
                    entry.Entity.UpdatedAt = currentTime;
                }

                if (entry.State == EntityState.Deleted)
                {
                    entry.State = EntityState.Modified;
                    entry.Entity.IsDeleted = true;
                    entry.Entity.DeletedBy = currentUser;
                    entry.Entity.DeletedAt = currentTime;
                }
            }
        }
    }

    public static class Extensions
    {
        public static bool HasChangedOwnedEntities(this EntityEntry entry) =>
            entry.References.Any(r =>
                r.TargetEntry != null &&
                r.TargetEntry.Metadata.IsOwned() &&
                (r.TargetEntry.State == EntityState.Added || r.TargetEntry.State == EntityState.Modified));
    }
}