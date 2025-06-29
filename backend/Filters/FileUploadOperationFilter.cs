using Microsoft.AspNetCore.Http;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Collections.Generic;
using System.Linq;

namespace FoodCalorie.Filters
{
    public class FileUploadOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var fileParams = context.MethodInfo
                .GetParameters()
                .Where(p => p.ParameterType == typeof(IFormFile))
                .ToList();
            if (!fileParams.Any()) return;

            var schema = new OpenApiSchema
            {
                Type = "object",
                Properties = new Dictionary<string, OpenApiSchema>(),
                Required = new HashSet<string>()
            };

            foreach (var p in fileParams)
            {
                schema.Properties[p.Name] = new OpenApiSchema
                {
                    Type = "string",
                    Format = "binary"
                };
                schema.Required.Add(p.Name);
            }

            operation.RequestBody = new OpenApiRequestBody
            {
                Content = new Dictionary<string, OpenApiMediaType>
                {
                    ["multipart/form-data"] = new OpenApiMediaType
                    {
                        Schema = schema
                    }
                }
            };
        }
    }
}
