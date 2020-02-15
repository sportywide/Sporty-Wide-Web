output "cluster_endpoint" {
  description = "The IP address of the cluster master."
  sensitive   = true
  value       = module.gke.endpoint
}

output "cluster_ca_certificate" {
  description = "The public certificate that is the root of trust for the cluster."
  sensitive   = true
  value       = module.gke.ca_certificate
}
