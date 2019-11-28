output "rds_dns" {
  value = aws_elasticache_cluster.redis_cluster.cluster_address
}
